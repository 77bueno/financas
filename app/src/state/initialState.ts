import type { AppState } from './types';
import { nextId } from '../utils/format';

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
    cents: 0,
    toast: false,
    toastMsg: '',
    userName: '',
    salary: 0,
    cardBill: 0,
    debts: [],
    investPct: 30,
    accounts: [],
    investments: [],
    goals: [],
    yearData: [],
    txns: [],
  };
}

/** Demo dataset ("Larissa") so people can explore the platform filled in. */
export function createDemoState(): AppState {
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
      { key: '2026-01', m: 'Jan', v: 38200 }, { key: '2026-02', m: 'Fev', v: 39800 },
      { key: '2026-03', m: 'Mar', v: 41100 }, { key: '2026-04', m: 'Abr', v: 43050 },
      { key: '2026-05', m: 'Mai', v: 46410 }, { key: '2026-06', m: 'Jun', v: 47890 },
    ],
    txns: [
      { id: nextId('txn'), icon: '💰', name: 'Salário', sub: 'Hoje · Conta corrente', amount: 5600 },
      { id: nextId('txn'), icon: '🛒', name: 'Alimentação', sub: 'Ontem · Mercado', amount: -238.90 },
      { id: nextId('txn'), icon: '🍔', name: 'Alimentação', sub: 'Ontem · iFood', amount: -52.40 },
      { id: nextId('txn'), icon: '🚗', name: 'Transporte', sub: '28 jun · Uber', amount: -19.80 },
      { id: nextId('txn'), icon: '📺', name: 'Assinaturas', sub: '27 jun · Netflix', amount: -55.90 },
      { id: nextId('txn'), icon: '🏠', name: 'Moradia', sub: '25 jun · Aluguel', amount: -1100 },
    ],
  };
}
