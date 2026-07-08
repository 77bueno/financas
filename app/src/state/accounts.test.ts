import { describe, it, expect } from 'vitest';
import { applyTxnToAccounts } from './store';
import type { Account } from './types';

const accounts = (): Account[] => [
  { id: 'cc', icon: '🏦', name: 'Conta corrente', bank: '', value: 1000, group: 'disp' },
  { id: 'pp', icon: '🐷', name: 'Poupança', bank: '', value: 500, group: 'reserva' },
];

describe('applyTxnToAccounts', () => {
  it('despesa debita a conta de origem', () => {
    const out = applyTxnToAccounts(accounts(), { amount: -120.5, accountId: 'cc', toAccountId: null, cat: 'Alimentação' }, 1);
    expect(out.find(a => a.id === 'cc')!.value).toBe(879.5);
    expect(out.find(a => a.id === 'pp')!.value).toBe(500);
  });

  it('receita credita a conta', () => {
    const out = applyTxnToAccounts(accounts(), { amount: 300, accountId: 'cc', toAccountId: null, cat: 'Receita' }, 1);
    expect(out.find(a => a.id === 'cc')!.value).toBe(1300);
  });

  it('transferência move entre as duas contas', () => {
    const out = applyTxnToAccounts(accounts(), { amount: -200, accountId: 'cc', toAccountId: 'pp', cat: 'Transferência' }, 1);
    expect(out.find(a => a.id === 'cc')!.value).toBe(800);
    expect(out.find(a => a.id === 'pp')!.value).toBe(700);
  });

  it('reverter (sign -1) desfaz exatamente o efeito', () => {
    const t = { amount: -200, accountId: 'cc', toAccountId: 'pp', cat: 'Transferência' };
    const applied = applyTxnToAccounts(accounts(), t, 1);
    const reverted = applyTxnToAccounts(applied, t, -1);
    expect(reverted.find(a => a.id === 'cc')!.value).toBe(1000);
    expect(reverted.find(a => a.id === 'pp')!.value).toBe(500);
  });

  it('sem conta vinculada nada muda', () => {
    const input = accounts();
    const out = applyTxnToAccounts(input, { amount: -50, accountId: null, toAccountId: null, cat: 'Lazer' }, 1);
    expect(out).toBe(input);
  });
});
