import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Screen, TxnType, AccountGroup, EditKind, Txn, Account, Recurrence } from './types';
import { createInitialState, createDemoState } from './initialState';
import { MONTHS_PT, CAT_PALETTE, defaultCategories } from './constants';
import { nextId, parseDigits, isoDate } from '../utils/format';
import { computeDerived } from './derived';

const LEGACY_KEY = 'financas-app-state-v3';
const dataKey = (userId: string) => `financas-data-v1:${userId}`;

function loadInitial(userId: string, accountName: string): AppState {
  const base = { ...createInitialState(), userName: accountName };
  try {
    let raw = localStorage.getItem(dataKey(userId));
    let fromLegacy = false;
    if (!raw) {
      raw = localStorage.getItem(LEGACY_KEY);
      fromLegacy = raw !== null;
    }
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      const merged: AppState = {
        ...base,
        ...parsed,
        categories: parsed.categories?.length ? parsed.categories : defaultCategories(),
        hubOpen: false,
        quickOpen: false,
        quickKind: null,
        quickName: '',
        quickCents: 0,
        addOpen: false,
        addDesc: '',
        addEditId: null,
        addRecurring: false,
        spendMonth: null,
        budgetCat: null,
        newCatOpen: false,
        editKind: null,
        editId: null,
        cents: 0,
        toast: false,
        toastMsg: '',
        connecting: false,
      };
      if (!merged.userName.trim()) merged.userName = accountName;
      if (fromLegacy) localStorage.removeItem(LEGACY_KEY);
      return merged;
    }
  } catch {
    // ignore corrupt storage
  }
  return base;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Applies (sign=+1) or reverts (sign=-1) a transaction's effect on account
 * balances. Despesa/receita move `amount` on the source account; transfers
 * additionally credit the destination account.
 */
function applyTxnToAccounts(accounts: Account[], t: Pick<Txn, 'amount' | 'accountId' | 'toAccountId' | 'cat'>, sign: 1 | -1): Account[] {
  if (!t.accountId && !t.toAccountId) return accounts;
  return accounts.map(a => {
    let v = a.value;
    if (a.id === t.accountId) v += sign * t.amount;
    if (t.cat === 'Transferência' && a.id === t.toAccountId) v += sign * Math.abs(t.amount);
    return v === a.value ? a : { ...a, value: Math.round(v * 100) / 100 };
  });
}

function useFinanceState(userId: string, accountName: string) {
  const [state, setState] = useState<AppState>(() => loadInitial(userId, accountName));
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const connectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem(dataKey(userId), JSON.stringify(state));
  }, [state, userId]);

  useEffect(() => () => {
    clearTimeout(toastTimer.current);
    clearTimeout(connectTimer.current);
  }, []);

  const patrimonio = useMemo(() => {
    const acc = state.accounts.reduce((a, b) => a + (b.value || 0), 0);
    const inv = state.investments.reduce((a, b) => a + (b.value || 0), 0);
    return acc + inv;
  }, [state.accounts, state.investments]);

  // record patrimônio once per month so the Year screen builds real history
  useEffect(() => {
    if (state.screen === 'onboard') return;
    const now = new Date();
    const key = monthKey(now);
    const label = MONTHS_PT[now.getMonth()];
    setState(p => {
      const last = p.yearData[p.yearData.length - 1];
      if (last?.key === key) {
        if (Math.abs(last.v - patrimonio) < 0.005) return p;
        return { ...p, yearData: p.yearData.map((d, i) => (i === p.yearData.length - 1 ? { ...d, v: patrimonio } : d)) };
      }
      return { ...p, yearData: [...p.yearData, { key, m: label, v: patrimonio }].slice(-12) };
    });
  }, [patrimonio, state.screen]);

  // auto-post monthly recurrences that are due and not yet posted this month
  useEffect(() => {
    if (state.screen === 'onboard' || state.recurrences.length === 0) return;
    const now = new Date();
    const ym = monthKey(now);
    const today = now.getDate();
    setState(p => {
      const due = p.recurrences.filter(r =>
        r.day <= today && !p.txns.some(t => t.recId === r.id && t.date.startsWith(ym)));
      if (due.length === 0) return p;
      let accounts = p.accounts;
      const posted: Txn[] = due.map(r => {
        const tx: Txn = {
          id: nextId('txn'), desc: r.desc, cat: r.cat, icon: r.icon,
          date: `${ym}-${String(r.day).padStart(2, '0')}`,
          amount: r.amount, accountId: r.accountId ?? null, toAccountId: null, recId: r.id,
        };
        accounts = applyTxnToAccounts(accounts, tx, 1);
        return tx;
      });
      const txns = [...posted, ...p.txns].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      return {
        ...p, accounts, txns, toast: true,
        toastMsg: due.length === 1 ? `↻ Recorrência lançada: ${due[0].desc}` : `↻ ${due.length} recorrências lançadas`,
      };
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 2600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.screen, state.recurrences.length]);

  const flashToast = useCallback((msg: string) => {
    setState(p => ({ ...p, toast: true, toastMsg: msg }));
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  const go = useCallback((s: Screen) => setState(p => ({ ...p, screen: s, addOpen: false })), []);

  const toggleEye = useCallback(() => setState(p => ({ ...p, hidden: !p.hidden })), []);

  const setCents = useCallback((v: string) => setState(p => ({ ...p, cents: Math.min(parseDigits(v), 99999999) })), []);
  const setAddDesc = useCallback((v: string) => setState(p => ({ ...p, addDesc: v })), []);

  // ---- transactions (create / edit / delete) ----
  const freshAdd = (p: AppState): AppState => ({
    ...p, addOpen: true, addEditId: null, addDesc: '', cents: 0, addType: 'despesa' as const, newCatOpen: false,
    addRecurring: false,
    addDate: isoDate(new Date()),
    addAccountId: p.accounts.find(a => a.group === 'disp')?.id ?? p.accounts[0]?.id ?? null,
    addToAccountId: null,
  });
  const openAdd = useCallback(() => setState(p => freshAdd(p)), []);
  const closeAdd = useCallback(() => setState(p => ({ ...p, addOpen: false, addEditId: null })), []);
  const addTxn = useCallback(() => setState(p => ({ ...freshAdd(p), hubOpen: false })), []);

  const setAddDate = useCallback((v: string) => setState(p => (v ? { ...p, addDate: v } : p)), []);
  const setAddAccountId = useCallback((id: string | null) => setState(p => ({ ...p, addAccountId: id })), []);
  const setAddToAccountId = useCallback((id: string | null) => setState(p => ({ ...p, addToAccountId: id })), []);

  const openEditTxn = useCallback((id: string) => {
    setState(p => {
      const t = p.txns.find(x => x.id === id);
      if (!t) return p;
      return {
        ...p,
        addOpen: true,
        addEditId: id,
        addDesc: t.desc,
        cents: Math.round(Math.abs(t.amount) * 100),
        addType: t.amount > 0 ? 'receita' : t.cat === 'Transferência' ? 'transferencia' : 'despesa',
        addCat: t.cat !== 'Receita' && t.cat !== 'Transferência' ? t.cat : p.addCat,
        addDate: t.date,
        addAccountId: t.accountId ?? null,
        addToAccountId: t.toAccountId ?? null,
        newCatOpen: false,
      };
    });
  }, []);

  const save = useCallback(() => {
    setState(p => {
      const val = p.cents / 100;
      if (val <= 0) return { ...p, addOpen: false, addEditId: null };
      const type = p.addType;
      const catMeta = p.categories.find(c => c.name === p.addCat);
      const base =
        type === 'receita'
          ? { cat: 'Receita', icon: '💰', amount: val }
          : type === 'transferencia'
            ? { cat: 'Transferência', icon: '🔁', amount: -val }
            : { cat: p.addCat, icon: catMeta?.icon || '💸', amount: -val };
      const desc = p.addDesc.trim() || base.cat;
      const accountId = p.addAccountId;
      const toAccountId = type === 'transferencia' && p.addToAccountId !== p.addAccountId ? p.addToAccountId : null;

      if (p.addEditId) {
        const old = p.txns.find(t => t.id === p.addEditId);
        if (!old) return { ...p, addOpen: false, addEditId: null };
        const updated: Txn = { ...old, ...base, desc, date: p.addDate, accountId, toAccountId };
        let accounts = applyTxnToAccounts(p.accounts, old, -1);
        accounts = applyTxnToAccounts(accounts, updated, 1);
        return {
          ...p,
          accounts,
          txns: p.txns.map(t => (t.id === p.addEditId ? updated : t)),
          addOpen: false, addEditId: null, addDesc: '', cents: 0, toast: true, toastMsg: '✓ Transação atualizada',
        };
      }

      let recurrences = p.recurrences;
      let recId: string | null = null;
      if (p.addRecurring && type !== 'transferencia') {
        const day = Math.min(parseInt(p.addDate.slice(8, 10), 10) || 1, 28);
        const rec: Recurrence = { id: nextId('rec'), desc, cat: base.cat, icon: base.icon, amount: base.amount, accountId, day };
        recurrences = [...p.recurrences, rec];
        recId = rec.id;
      }
      const tx: Txn = { id: nextId('txn'), desc, date: p.addDate, accountId, toAccountId, recId, ...base };
      const accounts = applyTxnToAccounts(p.accounts, tx, 1);
      const txns = [tx, ...p.txns].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      return {
        ...p, accounts, txns, recurrences, addOpen: false, addDesc: '', cents: 0, addRecurring: false,
        toast: true, toastMsg: recId ? '✓ Adicionada · repete todo mês' : '✓ Transação adicionada',
      };
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  const deleteTxn = useCallback((id: string) => {
    setState(p => {
      const t = p.txns.find(x => x.id === id);
      const accounts = t ? applyTxnToAccounts(p.accounts, t, -1) : p.accounts;
      return { ...p, accounts, txns: p.txns.filter(x => x.id !== id), addOpen: false, addEditId: null, toast: true, toastMsg: '✓ Transação excluída' };
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  // ---- custom categories ----
  const toggleNewCat = useCallback(() => setState(p => ({ ...p, newCatOpen: !p.newCatOpen, newCatName: '', newCatIcon: '🎓' })), []);
  const setNewCatName = useCallback((v: string) => setState(p => ({ ...p, newCatName: v })), []);
  const setNewCatIcon = useCallback((v: string) => setState(p => ({ ...p, newCatIcon: v })), []);
  const saveNewCat = useCallback(() => {
    setState(p => {
      const name = p.newCatName.trim();
      if (!name) return { ...p, newCatOpen: false };
      if (p.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        return { ...p, newCatOpen: false, addCat: p.categories.find(c => c.name.toLowerCase() === name.toLowerCase())!.name };
      }
      const pal = CAT_PALETTE[p.categories.length % CAT_PALETTE.length];
      const cat = { id: nextId('cat'), name, icon: p.newCatIcon, color: pal.color, bg: pal.bg };
      return { ...p, categories: [...p.categories, cat], addCat: name, newCatOpen: false, newCatName: '' };
    });
  }, []);

  // ---- profile ----
  const setSalary = useCallback((v: string) => setState(p => ({ ...p, salary: parseDigits(v) })), []);
  const setCardBill = useCallback((v: string) => setState(p => ({ ...p, cardBill: parseDigits(v) })), []);
  const setUserName = useCallback((v: string) => setState(p => ({ ...p, userName: v })), []);

  // ---- planner debts ----
  const updateDebt = useCallback((id: string, field: 'name' | 'value', v: string) => {
    setState(p => ({
      ...p,
      debts: p.debts.map(d => d.id === id ? { ...d, [field]: field === 'value' ? parseDigits(v) : v } : d),
    }));
  }, []);
  const addDebt = useCallback(() => setState(p => ({ ...p, debts: [...p.debts, { id: nextId('debt'), name: '', value: 0 }] })), []);
  const removeDebt = useCallback((id: string) => setState(p => ({ ...p, debts: p.debts.filter(d => d.id !== id) })), []);

  // ---- onboarding ----
  const startManual = useCallback(() => setState(p => {
    const step = p.userName.trim() ? 2 : 1;
    if (step === 2 && p.accounts.length === 0) {
      return { ...p, onbStep: step, accounts: [{ id: nextId('acc'), icon: '🏦', name: '', bank: 'Conta', value: 0, group: 'disp' as const }] };
    }
    return { ...p, onbStep: step };
  }), []);
  const loadDemo = useCallback(() => {
    setState(p => ({ ...p, connecting: true }));
    clearTimeout(connectTimer.current);
    connectTimer.current = setTimeout(() => setState(() => ({ ...createDemoState(), connecting: false })), 1200);
  }, []);
  const onbNext = useCallback(() => {
    setState(p => {
      const next = p.onbStep + 1;
      if (next === 2 && p.accounts.length === 0) {
        return { ...p, onbStep: next, accounts: [{ id: nextId('acc'), icon: '🏦', name: '', bank: 'Conta', value: 0, group: 'disp' as const }] };
      }
      return { ...p, onbStep: next };
    });
  }, []);
  const onbBack = useCallback(() => setState(p => ({ ...p, onbStep: Math.max(0, p.onbStep - 1) })), []);
  const finishOnb = useCallback(() => {
    setState(p => ({
      ...p,
      screen: 'home',
      onbStep: 0,
      accounts: p.accounts.filter(a => a.name.trim() !== '' || a.value > 0),
    }));
  }, []);

  const addAccount = useCallback(() => setState(p => ({ ...p, accounts: [...p.accounts, { id: nextId('acc'), icon: '🏦', name: '', bank: 'Conta', value: 0, group: 'disp' as const }] })), []);
  const updateAccount = useCallback((id: string, field: 'name' | 'value', v: string) => {
    setState(p => ({
      ...p,
      accounts: p.accounts.map(a => a.id === id ? { ...a, [field]: field === 'value' ? parseDigits(v) : v } : a),
    }));
  }, []);
  const removeAccount = useCallback((id: string) => setState(p => ({ ...p, accounts: p.accounts.filter(a => a.id !== id) })), []);

  // ---- hub / quick add ----
  const openHub = useCallback(() => setState(p => ({ ...p, hubOpen: true })), []);
  const closeHub = useCallback(() => setState(p => ({ ...p, hubOpen: false })), []);
  const openQuick = useCallback((kind: 'conta' | 'cofrinho' | 'investimento') => {
    setState(p => ({ ...p, hubOpen: false, quickOpen: true, quickKind: kind, quickName: '', quickCents: 0, quickGroup: 'disp' }));
  }, []);
  const closeQuick = useCallback(() => setState(p => ({ ...p, quickOpen: false })), []);
  const setQuickCents = useCallback((v: string) => setState(p => ({ ...p, quickCents: Math.min(parseDigits(v), 9999999999) })), []);
  const setQuickName = useCallback((v: string) => setState(p => ({ ...p, quickName: v })), []);
  const setQuickGroup = useCallback((g: AccountGroup) => setState(p => ({ ...p, quickGroup: g })), []);

  const saveQuick = useCallback(() => {
    setState(p => {
      const kind = p.quickKind;
      const val = p.quickCents / 100;
      const name = (p.quickName || '').trim();
      let next: Partial<AppState> = {};
      let msg = '✓ Salvo';
      if (kind === 'conta') {
        const reserva = p.quickGroup === 'reserva';
        next = { accounts: [...p.accounts, { id: nextId('acc'), icon: reserva ? '🐷' : '🏦', name: name || 'Nova conta', bank: reserva ? 'Guardado' : 'Conta', value: val, group: p.quickGroup }] };
        msg = '✓ Conta adicionada';
      } else if (kind === 'cofrinho') {
        next = { goals: [...p.goals, { id: nextId('goal'), icon: '🐷', name: name || 'Novo cofrinho', sub: 'Meta', saved: 0, target: val || 1000, color: '#10B981' }] };
        msg = '✓ Cofrinho criado';
      } else if (kind === 'investimento') {
        next = { investments: [...p.investments, { id: nextId('inv'), name: name || 'Novo aporte', value: val, cls: 'aporte', ret: '—', good: true, color: '#34D399' }] };
        msg = '✓ Investimento adicionado';
      }
      return { ...p, ...next, quickOpen: false, toast: true, toastMsg: msg };
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  // ---- edit existing items (conta / investimento / cofrinho) ----
  const openEditItem = useCallback((kind: Exclude<EditKind, null>, id: string) => {
    setState(p => {
      if (kind === 'conta') {
        const a = p.accounts.find(x => x.id === id);
        if (!a) return p;
        return { ...p, editKind: kind, editId: id, editName: a.name, editCents: Math.round(a.value * 100), editCents2: 0, editGroup: a.group };
      }
      if (kind === 'investimento') {
        const iv = p.investments.find(x => x.id === id);
        if (!iv) return p;
        return { ...p, editKind: kind, editId: id, editName: iv.name, editCents: Math.round(iv.value * 100), editCents2: 0 };
      }
      const g = p.goals.find(x => x.id === id);
      if (!g) return p;
      return { ...p, editKind: kind, editId: id, editName: g.name, editCents: Math.round(g.saved * 100), editCents2: Math.round(g.target * 100) };
    });
  }, []);
  const closeEdit = useCallback(() => setState(p => ({ ...p, editKind: null, editId: null })), []);
  const setEditName = useCallback((v: string) => setState(p => ({ ...p, editName: v })), []);
  const setEditCents = useCallback((v: string) => setState(p => ({ ...p, editCents: Math.min(parseDigits(v), 9999999999) })), []);
  const setEditCents2 = useCallback((v: string) => setState(p => ({ ...p, editCents2: Math.min(parseDigits(v), 9999999999) })), []);
  const setEditGroup = useCallback((g: AccountGroup) => setState(p => ({ ...p, editGroup: g })), []);

  const saveEdit = useCallback(() => {
    setState(p => {
      const { editKind: kind, editId: id } = p;
      if (!kind || !id) return p;
      const name = p.editName.trim();
      const val = p.editCents / 100;
      let next: Partial<AppState> = {};
      if (kind === 'conta') {
        next = { accounts: p.accounts.map(a => a.id === id ? { ...a, name: name || a.name, value: val, group: p.editGroup, icon: p.editGroup === 'reserva' ? '🐷' : a.icon } : a) };
      } else if (kind === 'investimento') {
        next = { investments: p.investments.map(iv => iv.id === id ? { ...iv, name: name || iv.name, value: val } : iv) };
      } else {
        next = { goals: p.goals.map(g => g.id === id ? { ...g, name: name || g.name, saved: val, target: p.editCents2 / 100 || g.target } : g) };
      }
      return { ...p, ...next, editKind: null, editId: null, toast: true, toastMsg: '✓ Alterações salvas' };
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  const deleteEdit = useCallback(() => {
    setState(p => {
      const { editKind: kind, editId: id } = p;
      if (!kind || !id) return p;
      let next: Partial<AppState> = {};
      if (kind === 'conta') next = { accounts: p.accounts.filter(a => a.id !== id) };
      else if (kind === 'investimento') next = { investments: p.investments.filter(iv => iv.id !== id) };
      else next = { goals: p.goals.filter(g => g.id !== id) };
      return { ...p, ...next, editKind: null, editId: null, toast: true, toastMsg: '✓ Excluído' };
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  const toggleAddRecurring = useCallback(() => setState(p => ({ ...p, addRecurring: !p.addRecurring })), []);
  const deleteRecurrence = useCallback((id: string) => {
    setState(p => ({ ...p, recurrences: p.recurrences.filter(r => r.id !== id), toast: true, toastMsg: '✓ Recorrência cancelada' }));
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  const setSpendMonth = useCallback((ym: string | null) => setState(p => ({ ...p, spendMonth: ym })), []);

  const openBudget = useCallback((cat: string) => {
    setState(p => {
      const c = p.categories.find(x => x.name === cat);
      return { ...p, budgetCat: cat, budgetCents: Math.round(((c?.budget ?? 0) * 100)) };
    });
  }, []);
  const closeBudget = useCallback(() => setState(p => ({ ...p, budgetCat: null })), []);
  const setBudgetCents = useCallback((v: string) => setState(p => ({ ...p, budgetCents: Math.min(parseDigits(v), 999999999) })), []);
  const saveBudget = useCallback(() => {
    setState(p => {
      if (!p.budgetCat) return p;
      const val = p.budgetCents / 100;
      return {
        ...p,
        categories: p.categories.map(c => c.name === p.budgetCat ? { ...c, budget: val > 0 ? val : undefined } : c),
        budgetCat: null, toast: true, toastMsg: val > 0 ? '✓ Orçamento definido' : '✓ Orçamento removido',
      };
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  /** Serializes the user's data for backup (no transient UI state). */
  const exportData = useCallback(() => {
    const { screen: _s, onbStep: _o, connecting: _c, hubOpen: _h, quickOpen: _q, addOpen: _a, toast: _t, toastMsg: _tm, editKind: _ek, editId: _ei, budgetCat: _bc, ...data } = state;
    const payload = { app: 'financas', version: 3, exportedAt: new Date().toISOString(), data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financas-backup-${isoDate(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importData = useCallback((text: string): { ok: boolean; error?: string } => {
    try {
      const payload = JSON.parse(text);
      const data = payload?.app === 'financas' ? payload.data : payload;
      if (!data || typeof data !== 'object' || !Array.isArray(data.txns) || !Array.isArray(data.accounts)) {
        return { ok: false, error: 'Arquivo não parece um backup do Finanças.' };
      }
      setState(p => ({
        ...createInitialState(),
        ...data,
        userName: data.userName || p.userName,
        screen: 'home',
        toast: true,
        toastMsg: '✓ Backup restaurado',
      }));
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setState(p2 => ({ ...p2, toast: false })), 1800);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Arquivo inválido.' };
    }
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(dataKey(userId));
    setState({ ...createInitialState(), userName: accountName });
  }, [userId, accountName]);

  const setInvestPct = useCallback((v: number) => setState(p => ({ ...p, investPct: v })), []);
  const setAddType = useCallback((t: TxnType) => setState(p => ({ ...p, addType: t })), []);
  const setAddCat = useCallback((c: string) => setState(p => ({ ...p, addCat: c })), []);

  const actions = useMemo(() => ({
    go,
    goHome: () => go('home'),
    goSpend: () => go('spend'),
    goInvest: () => go('invest'),
    goGoals: () => go('goals'),
    goWealth: () => go('wealth'),
    goPlan: () => go('plan'),
    goYear: () => go('year'),
    goProfile: () => go('profile'),
    goTxns: () => go('txns'),
    toggleEye,
    setCents,
    setAddDesc,
    setAddDate,
    setAddAccountId,
    setAddToAccountId,
    save,
    deleteTxn,
    openEditTxn,
    toggleNewCat,
    setNewCatName,
    setNewCatIcon,
    saveNewCat,
    setSalary,
    setCardBill,
    setUserName,
    updateDebt,
    addDebt,
    removeDebt,
    startManual,
    loadDemo,
    onbNext,
    onbBack,
    finishOnb,
    addAccount,
    updateAccount,
    removeAccount,
    openHub,
    closeHub,
    openQuick,
    closeQuick,
    setQuickCents,
    setQuickName,
    setQuickGroup,
    saveQuick,
    openEditItem,
    closeEdit,
    setEditName,
    setEditCents,
    setEditCents2,
    setEditGroup,
    saveEdit,
    deleteEdit,
    toggleAddRecurring,
    deleteRecurrence,
    setSpendMonth,
    openBudget,
    closeBudget,
    setBudgetCents,
    saveBudget,
    exportData,
    importData,
    resetAll,
    setInvestPct,
    setAddType,
    setAddCat,
    openAdd,
    closeAdd,
    addTxn,
    flashToast,
  }), [go, toggleEye, setCents, setAddDesc, setAddDate, setAddAccountId, setAddToAccountId, save, deleteTxn, openEditTxn, toggleNewCat, setNewCatName, setNewCatIcon,
      saveNewCat, setSalary, setCardBill, setUserName, updateDebt, addDebt, removeDebt,
      startManual, loadDemo, onbNext, onbBack, finishOnb, addAccount, updateAccount, removeAccount,
      openHub, closeHub, openQuick, closeQuick, setQuickCents, setQuickName, setQuickGroup, saveQuick,
      openEditItem, closeEdit, setEditName, setEditCents, setEditCents2, setEditGroup, saveEdit, deleteEdit,
      toggleAddRecurring, deleteRecurrence, setSpendMonth, openBudget, closeBudget, setBudgetCents, saveBudget,
      exportData, importData, resetAll, setInvestPct, setAddType, setAddCat, openAdd, closeAdd, addTxn, flashToast]);

  const derived = useMemo(() => computeDerived(state), [state]);

  return { state, actions, derived };
}

type FinanceContextValue = ReturnType<typeof useFinanceState>;

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ userId, userName, children }: { userId: string; userName: string; children: ReactNode }) {
  const value = useFinanceState(userId, userName);
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
