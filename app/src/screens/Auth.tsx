import { useState } from 'react';
import { useAuth } from '../auth/authStore';
import { Icon } from '../components/Icon';

type Mode = 'login' | 'signup' | 'recover';

const label: React.CSSProperties = { fontSize: 12, color: 'var(--t3)', fontWeight: 500, display: 'block', marginBottom: 6 };

const inputWrap: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  background: 'var(--card)', border: '1px solid var(--w10)', borderRadius: 10,
  padding: '0 12px', marginBottom: 14,
};

const inputStyle: React.CSSProperties = {
  flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
  color: 'var(--t1)', fontFamily: "'Inter'", fontSize: 14, padding: '12px 0',
};

const primaryBtn: React.CSSProperties = {
  width: '100%', padding: 13, background: '#10B981', border: 'none', borderRadius: 10,
  color: '#04120C', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
};

const linkBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--green)', fontSize: 13, fontWeight: 500,
  cursor: 'pointer', fontFamily: "'Inter'", padding: 0,
};

function Field({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={inputWrap}>
      <Icon name={icon} size={16} style={{ color: 'var(--t4)' }} />
      {children}
    </div>
  );
}

export function Auth() {
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [code, setCode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);

  const switchMode = (m: Mode) => { setMode(m); setError(''); };

  const submit = async () => {
    setError('');
    if (mode === 'signup') {
      if (password !== password2) { setError('As senhas não coincidem.'); return; }
      const r = await auth.signUp(name, email, password);
      if (!r.ok) setError(r.error);
      else setRecoveryCode(r.recoveryCode);
    } else if (mode === 'login') {
      const r = await auth.signIn(email, password);
      if (!r.ok) setError(r.error);
    } else {
      if (password !== password2) { setError('As senhas não coincidem.'); return; }
      const r = await auth.recover(email, code, password);
      if (!r.ok) setError(r.error);
      else setRecoveryCode(r.recoveryCode);
    }
  };

  // recovery-code interstitial: the session stays pending until the user confirms
  if (recoveryCode) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter'" }}>
        <div style={{ width: '100%', maxWidth: 420, background: 'var(--card)', border: '1px solid var(--w8)', borderRadius: 16, padding: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(52,211,153,.14)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Icon name="key" size={20} />
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 19, color: 'var(--t1)', fontWeight: 700 }}>Guarde seu código de recuperação</h2>
          <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'var(--t3)', lineHeight: 1.55 }}>
            É a <strong style={{ color: 'var(--t1)' }}>única forma</strong> de redefinir sua senha se você esquecer — seus dados ficam só neste dispositivo e não há e-mail de recuperação. Anote em lugar seguro:
          </p>
          <div style={{ background: 'var(--card)', border: '1px dashed rgba(52,211,153,.4)', borderRadius: 10, padding: '16px 12px', textAlign: 'center', marginBottom: 18 }}>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 22, fontWeight: 600, color: 'var(--green)', letterSpacing: '.06em' }}>{recoveryCode}</span>
          </div>
          <button onClick={auth.confirmPending} style={primaryBtn}>Anotei, continuar</button>
        </div>
      </div>
    );
  }

  const titles: Record<Mode, [string, string]> = {
    login: ['Entrar', 'Acesse seu painel financeiro.'],
    signup: ['Criar conta', 'Leva menos de um minuto.'],
    recover: ['Recuperar acesso', 'Use o código de recuperação que você guardou ao criar a conta.'],
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter'" }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 28, justifyContent: 'center' }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04120C' }}>
            <Icon name="wallet" size={21} strokeWidth={2} />
          </div>
          <strong style={{ fontSize: 20, color: 'var(--t1)', fontWeight: 700, letterSpacing: '-.01em' }}>Finanças</strong>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--w8)', borderRadius: 16, padding: 28 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 20, color: 'var(--t1)', fontWeight: 700 }}>{titles[mode][0]}</h1>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--t3)', lineHeight: 1.5 }}>{titles[mode][1]}</p>

          {mode === 'signup' && (
            <>
              <span style={label}>Nome</span>
              <Field icon="user">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" style={inputStyle} />
              </Field>
            </>
          )}

          <span style={label}>E-mail</span>
          <Field icon="mail">
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@exemplo.com" type="email" autoComplete="email" style={inputStyle} />
          </Field>

          {mode === 'recover' && (
            <>
              <span style={label}>Código de recuperação</span>
              <Field icon="key">
                <input value={code} onChange={e => setCode(e.target.value)} placeholder="XXXX-XXXX-XXXX" style={{ ...inputStyle, fontFamily: "'Space Grotesk'", letterSpacing: '.05em' }} />
              </Field>
            </>
          )}

          <span style={label}>{mode === 'recover' ? 'Nova senha' : 'Senha'}</span>
          <Field icon="lock">
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              type={showPass ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              style={inputStyle}
              onKeyDown={e => { if (e.key === 'Enter' && mode === 'login') submit(); }}
            />
            <button onClick={() => setShowPass(s => !s)} style={{ background: 'none', border: 'none', color: 'var(--t4)', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <Icon name={showPass ? 'eyeOff' : 'eye'} size={16} />
            </button>
          </Field>

          {(mode === 'signup' || mode === 'recover') && (
            <>
              <span style={label}>Confirmar senha</span>
              <Field icon="lock">
                <input value={password2} onChange={e => setPassword2(e.target.value)} placeholder="••••••••" type={showPass ? 'text' : 'password'} autoComplete="new-password" style={inputStyle} />
              </Field>
            </>
          )}

          {error && (
            <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 10, padding: '10px 12px', marginBottom: 14, fontSize: 12.5, color: 'var(--red2)' }}>
              {error}
            </div>
          )}

          <button onClick={submit} disabled={auth.busy} style={{ ...primaryBtn, opacity: auth.busy ? 0.6 : 1 }}>
            {auth.busy ? 'Aguarde…' : titles[mode][0]}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
            {mode === 'login' ? (
              <>
                <button onClick={() => switchMode('signup')} style={linkBtn}>Criar conta</button>
                <button onClick={() => switchMode('recover')} style={{ ...linkBtn, color: 'var(--t3)' }}>Esqueci a senha</button>
              </>
            ) : (
              <button onClick={() => switchMode('login')} style={linkBtn}>‹ Voltar pro login</button>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--t5)', marginTop: 18, lineHeight: 1.5 }}>
          Suas contas e dados ficam salvos <strong style={{ color: 'var(--t5)' }}>somente neste dispositivo</strong>.<br />
          Nada é enviado a servidores.
        </p>
      </div>
    </div>
  );
}
