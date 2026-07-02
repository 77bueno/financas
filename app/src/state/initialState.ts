import type { AppState } from './types';
import { nextId, isoDate, isoDaysAgo } from '../utils/format';
import { defaultCategories } from './constants';

export function createInitialState(): AppState {
  return {
    screen: 'onboard',
    onbStep: 0,
    connecting: false,
    hubOpen: false,
    quickOpen: false,
    quickKind: null,
    quickName: '',
    quickCents: 0,
    quickGroup: 'disp',
    hidden: false,
    addOpen: false,
    addType: 'despesa',
    addCat: 'Alimentação',
    addDesc: '',
    addEditId: null,
    newCatOpen: false,
    newCatName: '',
    newCatIcon: '🎓',
    editKind: null,
    editId: null,
    editName: '',
    editCents: 0,
    editCents2: 0,
    editGroup: 'disp',
    cents: 0,
    toast: false,
    toastMsg: '',
    userName: '',
    salary: 0,
    cardBill: 0,
    debts: [],
    investPct: 30,
    categories: defaultCategories(),
    accounts: [],
    investments: [],
    goals: [],
    yearData: [],
    txns: [],
  };
}

/** Demo dataset ("Larissa") so people can explore the platform filled in. */
export function createDemoState(): AppState {
  const now = new Date();
  const ym = (offset: number) => {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };
  const ml = (offset: number) => {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][d.getMonth()];
  };
  return {
    ...createInitialState(),
    screen: 'home',
    userName: 'Larissa',
    salary: 5600,
    cardBill: 1180,
    debts: [
      { id: nextId('debt'), name: 'Aluguel', value: 1100 },
      { id: nextId('debt'), name: 'Cartão de crédito', value: 480 },
      { id: nextId('debt'), name: 'Financiamento do carro', value: 350 },
    ],
    accounts: [
      { id: nextId('acc'), icon: '🏦', name: 'Conta corrente', bank: 'Banco Roxo', value: 3740.20, group: 'disp' },
      { id: nextId('acc'), icon: '💵', name: 'Carteira', bank: 'Dinheiro em espécie', value: 240, group: 'disp' },
      { id: nextId('acc'), icon: '🐷', name: 'Reserva / Poupança', bank: 'rende 100% CDI', value: 8500, group: 'reserva' },
    ],
    investments: [
      { id: nextId('inv'), name: 'Tesouro Selic', value: 12000, cls: 'renda fixa', ret: '+0,9%/mês', good: true, color: '#8E7BFF' },
      { id: nextId('inv'), name: 'CDB 108% CDI', value: 9500, cls: 'renda fixa', ret: '+1,0%/mês', good: true, color: '#6EE7B0' },
      { id: nextId('inv'), name: 'Ações', value: 7200, cls: 'renda variável', ret: '↑ +4,2%', good: true, color: '#E8B96A' },
      { id: nextId('inv'), name: 'Fundos imobiliários', value: 4300, cls: 'FIIs', ret: '+0,7%/mês', good: true, color: '#B9A6FF' },
      { id: nextId('inv'), name: 'Cripto', value: 2410, cls: 'alto risco', ret: '↓ -2,1%', good: false, color: '#FF8FB3' },
    ],
    goals: [
      { id: nextId('goal'), icon: '✈️', name: 'Viagem — Chile', sub: 'Dezembro 2026', saved: 2100, target: 3000, color: '#8E7BFF' },
      { id: nextId('goal'), icon: '🛟', name: 'Reserva de emergência', sub: '6 meses de custo', saved: 4500, target: 10000, color: '#6EE7B0' },
      { id: nextId('goal'), icon: '📱', name: 'Trocar celular', sub: 'Setembro 2026', saved: 900, target: 2500, color: '#E8B96A' },
    ],
    yearData: [
      { key: ym(5), m: ml(5), v: 38200 }, { key: ym(4), m: ml(4), v: 39800 },
      { key: ym(3), m: ml(3), v: 41100 }, { key: ym(2), m: ml(2), v: 43050 },
      { key: ym(1), m: ml(1), v: 46410 },
    ],
    txns: [
      { id: nextId('txn'), desc: 'Salário', cat: 'Receita', icon: '💰', date: isoDate(now), amount: 5600 },
      { id: nextId('txn'), desc: 'Mercado Extra', cat: 'Alimentação', icon: '🛒', date: isoDaysAgo(1), amount: -238.90 },
      { id: nextId('txn'), desc: 'iFood', cat: 'Alimentação', icon: '🍔', date: isoDaysAgo(1), amount: -52.40 },
      { id: nextId('txn'), desc: 'Uber', cat: 'Transporte', icon: '🚗', date: isoDaysAgo(3), amount: -19.80 },
      { id: nextId('txn'), desc: 'Netflix', cat: 'Assinaturas', icon: '📺', date: isoDaysAgo(4), amount: -55.90 },
      { id: nextId('txn'), desc: 'Aluguel', cat: 'Moradia', icon: '🏠', date: isoDaysAgo(6), amount: -1100 },
    ],
  };
}
