import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { hashSecret, verifySecret, generateRecoveryCode, normalizeRecoveryCode } from './crypto';

const USERS_KEY = 'financas-users-v1';
const SESSION_KEY = 'financas-session-v1';

export interface StoredUser {
  id: string;
  name: string;
  email: string; // normalized lowercase
  passHash: string;
  passSalt: string;
  recHash: string;
  recSalt: string;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as StoredUser[];
  } catch { /* corrupt registry -> start clean */ }
  return [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as SessionUser;
  } catch { /* ignore */ }
  return null;
}

function newId(): string {
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useAuthState() {
  const [session, setSession] = useState<SessionUser | null>(loadSession);
  const [pending, setPending] = useState<SessionUser | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  /** Creates the account and returns the one-time recovery code. */
  const signUp = useCallback(async (name: string, email: string, password: string): Promise<{ ok: true; recoveryCode: string } | { ok: false; error: string }> => {
    const n = name.trim();
    const e = email.trim().toLowerCase();
    if (!n) return { ok: false, error: 'Informe seu nome.' };
    if (!EMAIL_RE.test(e)) return { ok: false, error: 'E-mail inválido.' };
    if (password.length < 6) return { ok: false, error: 'A senha precisa de pelo menos 6 caracteres.' };
    const users = loadUsers();
    if (users.some(u => u.email === e)) return { ok: false, error: 'Já existe uma conta com esse e-mail neste dispositivo.' };
    setBusy(true);
    try {
      const recoveryCode = generateRecoveryCode();
      const pass = await hashSecret(password);
      const rec = await hashSecret(normalizeRecoveryCode(recoveryCode));
      const user: StoredUser = {
        id: newId(), name: n, email: e,
        passHash: pass.hash, passSalt: pass.salt,
        recHash: rec.hash, recSalt: rec.salt,
        createdAt: new Date().toISOString(),
      };
      saveUsers([...users, user]);
      setPending({ id: user.id, name: user.name, email: user.email });
      return { ok: true, recoveryCode };
    } finally {
      setBusy(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> => {
    const e = email.trim().toLowerCase();
    const user = loadUsers().find(u => u.email === e);
    setBusy(true);
    try {
      if (!user || !(await verifySecret(password, user.passHash, user.passSalt))) {
        return { ok: false, error: 'E-mail ou senha incorretos.' };
      }
      setSession({ id: user.id, name: user.name, email: user.email });
      return { ok: true };
    } finally {
      setBusy(false);
    }
  }, []);

  /** Reset password with the recovery code; returns a NEW recovery code. */
  const recover = useCallback(async (email: string, code: string, newPassword: string): Promise<{ ok: true; recoveryCode: string } | { ok: false; error: string }> => {
    const e = email.trim().toLowerCase();
    if (newPassword.length < 6) return { ok: false, error: 'A nova senha precisa de pelo menos 6 caracteres.' };
    const users = loadUsers();
    const user = users.find(u => u.email === e);
    setBusy(true);
    try {
      if (!user || !(await verifySecret(normalizeRecoveryCode(code), user.recHash, user.recSalt))) {
        return { ok: false, error: 'E-mail ou código de recuperação incorretos.' };
      }
      const recoveryCode = generateRecoveryCode();
      const pass = await hashSecret(newPassword);
      const rec = await hashSecret(normalizeRecoveryCode(recoveryCode));
      const updated: StoredUser = { ...user, passHash: pass.hash, passSalt: pass.salt, recHash: rec.hash, recSalt: rec.salt };
      saveUsers(users.map(u => (u.id === user.id ? updated : u)));
      setPending({ id: user.id, name: user.name, email: user.email });
      return { ok: true, recoveryCode };
    } finally {
      setBusy(false);
    }
  }, []);

  const changePassword = useCallback(async (current: string, next: string): Promise<{ ok: true } | { ok: false; error: string }> => {
    if (!session) return { ok: false, error: 'Sessão expirada.' };
    if (next.length < 6) return { ok: false, error: 'A nova senha precisa de pelo menos 6 caracteres.' };
    const users = loadUsers();
    const user = users.find(u => u.id === session.id);
    if (!user) return { ok: false, error: 'Conta não encontrada.' };
    setBusy(true);
    try {
      if (!(await verifySecret(current, user.passHash, user.passSalt))) {
        return { ok: false, error: 'Senha atual incorreta.' };
      }
      const pass = await hashSecret(next);
      saveUsers(users.map(u => (u.id === user.id ? { ...u, passHash: pass.hash, passSalt: pass.salt } : u)));
      return { ok: true };
    } finally {
      setBusy(false);
    }
  }, [session]);

  const signOut = useCallback(() => setSession(null), []);

  /** Promotes the pending session after the user confirms they saved the recovery code. */
  const confirmPending = useCallback(() => {
    setPending(p => {
      if (p) setSession(p);
      return null;
    });
  }, []);

  return useMemo(() => ({ session, pending, busy, signUp, signIn, recover, changePassword, signOut, confirmPending }), [session, pending, busy, signUp, signIn, recover, changePassword, signOut, confirmPending]);
}

type AuthContextValue = ReturnType<typeof useAuthState>;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
