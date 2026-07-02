import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Screen, TxnType, AccountGroup } from './types';
import { createInitialState, createDemoState } from './initialState';
import { CAT_ICONS, MONTHS_PT } from './constants';
import { nextId, parseDigits } from '../utils/format';
import { computeDerived } from './derived';

const STORAGE_KEY = 'financas-app-state-v2';

function loadInitial(): AppState {
  const base = createInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      return {
        ...base,
        ...parsed,
        hubOpen: false,
        quickOpen: false,
        quickKind: null,
        quickName: '',
        quickCents: 0,
        addOpen: false,
        cents: 0,
        toast: false,
        toastMsg: '',
        connecting: false,
      };
    }
  } catch {
    // ignore corrupt storage
  }
  return base;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function useFinanceState() {
  const [state, setState] = useState<AppState>(loadInitial);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const connectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

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

  const showToast = useCallback((msg: string) => {
    setState(p => ({ ...p, toast: true, toastMsg: msg }));
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  const go = useCallback((s: Screen) => setState(p => ({ ...p, screen: s, addOpen: false })), []);

  const toggleEye = useCallback(() => setState(p => ({ ...p, hidden: !p.hidden })), []);

  const press = useCallback((d: number) => setState(p => ({ ...p, cents: Math.min(p.cents * 10 + d, 99999999) })), []);
  const backspace = useCallback(() => setState(p => ({ ...p, cents: Math.floor(p.cents / 10) })), []);

  const save = useCallback(() => {
    setState(p => {
      const val = p.cents / 100;
      if (val <= 0) return { ...p, addOpen: false };
      const type = p.addType;
      const tx =
        type === 'receita'
          ? { id: nextId('txn'), icon: '💰', name: 'Receita', sub: 'Hoje', amount: val }
          : type === 'transferencia'
            ? { id: nextId('txn'), icon: '🔁', name: 'Transferência', sub: 'Hoje', amount: -val }
            : { id: nextId('txn'), icon: CAT_ICONS[p.addCat] || '💸', name: p.addCat, sub: 'Hoje', amount: -val };
      return { ...p, txns: [tx, ...p.txns], addOpen: false, cents: 0, toast: true, toastMsg: '✓ Transação adicionada' };
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  const setSalary = useCallback((v: string) => setState(p => ({ ...p, salary: parseDigits(v) })), []);
  const setCardBill = useCallback((v: string) => setState(p => ({ ...p, cardBill: parseDigits(v) })), []);
  const setUserName = useCallback((v: string) => setState(p => ({ ...p, userName: v })), []);

  const updateDebt = useCallback((id: string, field: 'name' | 'value', v: string) => {
    setState(p => ({
      ...p,
      debts: p.debts.map(d => d.id === id ? { ...d, [field]: field === 'value' ? parseDigits(v) : v } : d),
    }));
  }, []);
  const addDebt = useCallback(() => setState(p => ({ ...p, debts: [...p.debts, { id: nextId('debt'), name: '', value: 0 }] })), []);
  const removeDebt = useCallback((id: string) => setState(p => ({ ...p, debts: p.debts.filter(d => d.id !== id) })), []);

  const startManual = useCallback(() => setState(p => ({ ...p, onbStep: 1 })), []);
  const loadDemo = useCallback(() => {
    setState(p => ({ ...p, connecting: true }));
    clearTimeout(connectTimer.current);
    connectTimer.current = setTimeout(() => setState(() => ({ ...createDemoState(), connecting: false })), 1200);
  }, []);
  const onbNext = useCallback(() => {
    setState(p => {
      const next = p.onbStep + 1;
      // entering the accounts step with nothing yet: seed one blank row
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

  const openHub = useCallback(() => setState(p => ({ ...p, hubOpen: true })), []);
  const closeHub = useCallback(() => setState(p => ({ ...p, hubOpen: false })), []);
  const openQuick = useCallback((kind: 'conta' | 'cofrinho' | 'investimento') => {
    setState(p => ({ ...p, hubOpen: false, quickOpen: true, quickKind: kind, quickName: '', quickCents: 0, quickGroup: 'disp' }));
  }, []);
  const closeQuick = useCallback(() => setState(p => ({ ...p, quickOpen: false })), []);
  const quickPress = useCallback((d: number) => setState(p => ({ ...p, quickCents: Math.min(p.quickCents * 10 + d, 9999999999) })), []);
  const quickBack = useCallback(() => setState(p => ({ ...p, quickCents: Math.floor(p.quickCents / 10) })), []);
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
        next = { goals: [...p.goals, { id: nextId('goal'), icon: '🐷', name: name || 'Novo cofrinho', sub: 'Meta', saved: 0, target: val || 1000, color: '#8E7BFF' }] };
        msg = '✓ Cofrinho criado';
      } else if (kind === 'investimento') {
        next = { investments: [...p.investments, { id: nextId('inv'), name: name || 'Novo aporte', value: val, cls: 'aporte', ret: '—', good: true, color: '#6EE7B0' }] };
        msg = '✓ Investimento adicionado';
      }
      return { ...p, ...next, quickOpen: false, toast: true, toastMsg: msg };
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState(p => ({ ...p, toast: false })), 1800);
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(createInitialState());
  }, []);

  const setInvestPct = useCallback((v: number) => setState(p => ({ ...p, investPct: v })), []);
  const setAddType = useCallback((t: TxnType) => setState(p => ({ ...p, addType: t })), []);
  const setAddCat = useCallback((c: string) => setState(p => ({ ...p, addCat: c })), []);
  const openAdd = useCallback(() => setState(p => ({ ...p, addOpen: true })), []);
  const closeAdd = useCallback(() => setState(p => ({ ...p, addOpen: false })), []);
  const addTxn = useCallback(() => setState(p => ({ ...p, hubOpen: false, addOpen: true })), []);

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
    toggleEye,
    press,
    backspace,
    save,
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
    quickPress,
    quickBack,
    setQuickName,
    setQuickGroup,
    saveQuick,
    resetAll,
    setInvestPct,
    setAddType,
    setAddCat,
    openAdd,
    closeAdd,
    addTxn,
    showToast,
  }), [go, toggleEye, press, backspace, save, setSalary, setCardBill, setUserName, updateDebt, addDebt, removeDebt,
      startManual, loadDemo, onbNext, onbBack, finishOnb, addAccount, updateAccount, removeAccount,
      openHub, closeHub, openQuick, closeQuick, quickPress, quickBack, setQuickName, setQuickGroup, saveQuick,
      resetAll, setInvestPct, setAddType, setAddCat, openAdd, closeAdd, addTxn, showToast]);

  const derived = useMemo(() => computeDerived(state), [state]);

  return { state, actions, derived };
}

type FinanceContextValue = ReturnType<typeof useFinanceState>;

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const value = useFinanceState();
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
