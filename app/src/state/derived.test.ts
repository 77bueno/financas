import { describe, it, expect, vi, afterEach } from 'vitest';
import { computeDerived } from './derived';
import { createInitialState } from './initialState';
import { fmt } from '../utils/format';
import type { AppState, Txn } from './types';

const now = new Date();
const ymOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const shiftYM = (delta: number) => ymOf(new Date(now.getFullYear(), now.getMonth() + delta, 1));
const currentYM = shiftYM(0);
const prevYM = shiftYM(-1);

let seq = 0;
function txn(over: Partial<Txn>): Txn {
  return {
    id: `t${++seq}`, desc: 'x', cat: 'Alimentação', icon: '🛒',
    date: `${currentYM}-05`, amount: -10, accountId: null, toAccountId: null,
    ...over,
  };
}

function state(over: Partial<AppState>): AppState {
  return { ...createInitialState(), screen: 'home', ...over };
}

describe('fluxo do mês (Entrou/Saiu/Sobrou)', () => {
  it('soma receitas e despesas do mês corrente', () => {
    const d = computeDerived(state({
      txns: [
        txn({ amount: 5000, cat: 'Receita' }),
        txn({ amount: -1200, cat: 'Moradia' }),
        txn({ amount: -300 }),
      ],
    }));
    expect(d.entrou).toBe(5000);
    expect(d.saiu).toBe(1500);
    expect(d.sobrou).toBe(3500);
  });

  it('exclui transferências do fluxo', () => {
    const d = computeDerived(state({
      txns: [
        txn({ amount: 5000, cat: 'Receita' }),
        txn({ amount: -800, cat: 'Transferência', accountId: 'a', toAccountId: 'b' }),
      ],
    }));
    expect(d.entrou).toBe(5000);
    expect(d.saiu).toBe(0);
  });

  it('ignora lançamentos de outros meses', () => {
    const d = computeDerived(state({
      txns: [txn({ amount: -100, date: `${prevYM}-10` })],
    }));
    expect(d.saiu).toBe(0);
  });
});

describe('gastos por categoria e orçamento', () => {
  it('agrupa gastos por categoria e calcula estouro do orçamento', () => {
    const base = createInitialState();
    const cats = base.categories.map(c => (c.name === 'Alimentação' ? { ...c, budget: 100 } : c));
    const d = computeDerived(state({
      categories: cats,
      txns: [txn({ amount: -80 }), txn({ amount: -40 })],
    }));
    expect(d.totalSpend).toBe(120);
    const alim = d.spendCats.find(c => c.name === 'Alimentação')!;
    expect(alim.total).toBe(120);
    expect(alim.budgetPct).toBe(120);
    expect(alim.overBudget).toBe(true);
    expect(d.overBudgetCount).toBe(1);
  });

  it('transferência não conta como gasto de categoria', () => {
    const d = computeDerived(state({
      txns: [txn({ amount: -500, cat: 'Transferência' })],
    }));
    expect(d.totalSpend).toBe(0);
  });
});

describe('comparação com o mês anterior', () => {
  it('calcula o delta percentual do total gasto', () => {
    const d = computeDerived(state({
      txns: [
        txn({ amount: -120 }),
        txn({ amount: -100, date: `${prevYM}-10` }),
      ],
    }));
    expect(d.spendDeltaStr).toContain('20% a mais');
    expect(d.spendDeltaColor).toBe('var(--red)');
  });

  it('gastar menos que o mês anterior é verde', () => {
    const d = computeDerived(state({
      txns: [
        txn({ amount: -50 }),
        txn({ amount: -100, date: `${prevYM}-10` }),
      ],
    }));
    expect(d.spendDeltaStr).toContain('50% a menos');
    expect(d.spendDeltaColor).toBe('var(--green)');
  });

  it('sem mês anterior não há comparação', () => {
    const d = computeDerived(state({ txns: [txn({ amount: -50 })] }));
    expect(d.spendDeltaStr).toBeNull();
  });

  it('marca o delta por categoria', () => {
    const d = computeDerived(state({
      txns: [
        txn({ amount: -150 }),
        txn({ amount: -100, date: `${prevYM}-10` }),
      ],
    }));
    const alim = d.spendCats.find(c => c.name === 'Alimentação')!;
    expect(alim.deltaStr).toBe('↑ 50%');
  });
});

describe('tendência de 6 meses', () => {
  it('gera 6 meses terminando no mês visto, com o atual selecionado', () => {
    const d = computeDerived(state({
      txns: [
        txn({ amount: -100 }),
        txn({ amount: -200, date: `${prevYM}-15` }),
      ],
    }));
    expect(d.spendTrend).toHaveLength(6);
    expect(d.spendTrend[5].ym).toBe(currentYM);
    expect(d.spendTrend[5].selected).toBe(true);
    expect(d.spendTrend[4].total).toBe(200);
    expect(d.hasTrend).toBe(true);
  });

  it('sem histórico suficiente não mostra tendência', () => {
    const d = computeDerived(state({ txns: [txn({ amount: -100 })] }));
    expect(d.hasTrend).toBe(false);
  });
});

describe('metas com prazo (ritmo mensal)', () => {
  const goal = (over: object) => ({
    id: 'g1', icon: '🐷', name: 'Meta', sub: '', saved: 0, target: 300, color: '#10B981', ...over,
  });

  it('divide o que falta pelos meses restantes (inclusive o atual)', () => {
    const d = computeDerived(state({ goals: [goal({ deadline: shiftYM(2) })] }));
    expect(d.goalRows[0].paceStr).toContain(`Guarde ${fmt(100)}/mês`);
  });

  it('prazo vencido com meta incompleta', () => {
    const d = computeDerived(state({ goals: [goal({ deadline: shiftYM(-1) })] }));
    expect(d.goalRows[0].paceStr).toContain('Prazo vencido');
    expect(d.goalRows[0].paceColor).toBe('var(--red)');
  });

  it('meta atingida', () => {
    const d = computeDerived(state({ goals: [goal({ saved: 300, deadline: shiftYM(2) })] }));
    expect(d.goalRows[0].paceStr).toBe('Meta atingida 🎉');
  });

  it('sem prazo não há ritmo', () => {
    const d = computeDerived(state({ goals: [goal({})] }));
    expect(d.goalRows[0].paceStr).toBeNull();
  });
});

describe('próximas contas do mês (recorrências futuras)', () => {
  afterEach(() => vi.useRealTimers());

  it('lista recorrências com dia ainda por vir e projeta a sobra', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10)); // 10 mar 2026
    const d = computeDerived(state({
      txns: [txn({ amount: 2000, cat: 'Receita', date: '2026-03-05' })],
      recurrences: [
        { id: 'r1', desc: 'Aluguel', cat: 'Moradia', icon: '🏠', amount: -800, accountId: null, day: 15 },
        { id: 'r2', desc: 'Academia', cat: 'Saúde', icon: '💪', amount: -100, accountId: null, day: 5 }, // já passou
      ],
    }));
    expect(d.upcomingRecs).toHaveLength(1);
    expect(d.upcomingRecs[0].desc).toBe('Aluguel');
    expect(d.upcomingRecs[0].day).toBe(15);
    // sobrou 2000 − aluguel 800 que ainda vem = 1200
    expect(d.forecastStr).toBe(fmt(1200));
    expect(d.forecastNeg).toBe(false);
  });

  it('previsão fica negativa quando as contas futuras superam a sobra', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10));
    const d = computeDerived(state({
      txns: [txn({ amount: 500, cat: 'Receita', date: '2026-03-05' })],
      recurrences: [{ id: 'r1', desc: 'Aluguel', cat: 'Moradia', icon: '🏠', amount: -800, accountId: null, day: 20 }],
    }));
    expect(d.forecastNeg).toBe(true);
    expect(d.forecastStr).toBe(fmt(300)); // exibido em módulo, sinal vem do contexto
  });

  it('sem recorrências futuras não há card', () => {
    const d = computeDerived(state({}));
    expect(d.hasUpcoming).toBe(false);
  });

  it('recorrência já lançada no mês não conta de novo (sem dupla contagem)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10));
    const d = computeDerived(state({
      // criada hoje com data futura: a 1ª transação já saiu no fluxo do mês
      txns: [txn({ amount: -99.9, date: '2026-03-28', recId: 'r1' })],
      recurrences: [{ id: 'r1', desc: 'Internet', cat: 'Assinaturas', icon: '🌐', amount: -99.9, accountId: null, day: 28 }],
    }));
    expect(d.hasUpcoming).toBe(false);
    expect(d.forecastStr).toBe(d.sobrouStr);
  });
});

describe('patrimônio', () => {
  it('soma contas e investimentos e desconta a fatura no líquido', () => {
    const d = computeDerived(state({
      cardBill: 500,
      accounts: [
        { id: 'a', icon: '🏦', name: 'CC', bank: '', value: 1000, group: 'disp' },
        { id: 'b', icon: '🐷', name: 'Poupança', bank: '', value: 2000, group: 'reserva' },
      ],
      investments: [{ id: 'i', name: 'Tesouro', value: 3000, cls: '', ret: '', good: true, color: '' }],
    }));
    expect(d.patrimonioStr).toBe(fmt(6000));
    expect(d.netWorthStr).toBe(fmt(5500));
  });
});
