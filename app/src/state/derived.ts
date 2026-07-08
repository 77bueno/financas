import type { AppState, Category } from './types';
import { fmt, dateLabel } from '../utils/format';
import { MONTHS_PT } from './constants';

const FALLBACK_CAT: Omit<Category, 'id' | 'name'> = { icon: '💸', color: '#94A3B8', bg: 'rgba(148,163,184,.16)' };

export function computeDerived(state: AppState) {
  const S = state.salary;
  const D = state.debts.reduce((a, b) => a + (b.value || 0), 0);
  const avail = Math.max(S - D, 0);
  const pct = state.investPct;
  const investV = (avail * pct) / 100;
  const dailyV = avail - investV;
  const commit = S > 0 ? Math.round((D / S) * 100) : 0;
  const w = (v: number) => (S > 0 ? (v / S) * 100 : 0) + '%';

  const cardBill = state.cardBill || 0;
  const dispTotal = state.accounts.filter(a => a.group === 'disp').reduce((a, b) => a + (b.value || 0), 0);
  const reservaTotal = state.accounts.filter(a => a.group === 'reserva').reduce((a, b) => a + (b.value || 0), 0);
  const investedTotal = state.investments.reduce((a, b) => a + (b.value || 0), 0);
  const patrimonio = dispTotal + reservaTotal + investedTotal;
  const netWorth = patrimonio - cardBill;
  const hasMoney = patrimonio > 0;

  const catByName = new Map(state.categories.map(c => [c.name, c]));
  const catMeta = (name: string) => catByName.get(name) ?? { ...FALLBACK_CAT, id: '', name };

  // current month scope (Home flow) + selected month (spending report)
  const now = new Date();
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const spendYM = state.spendMonth ?? currentYM;
  const monthTxns = state.txns.filter(t => t.date.startsWith(spendYM));

  // month flow from the CURRENT month's transactions; transfers between own
  // accounts move money around but don't enter or leave
  const flowTxns = state.txns.filter(t => t.date.startsWith(currentYM) && t.cat !== 'Transferência');
  const entrou = flowTxns.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
  const saiu = flowTxns.filter(t => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);
  const sobrou = entrou - saiu;

  // spending by category this month (transfers between accounts don't count)
  const catTotals = new Map<string, number>();
  for (const t of monthTxns) {
    if (t.amount < 0 && t.cat !== 'Transferência') {
      catTotals.set(t.cat, (catTotals.get(t.cat) || 0) + Math.abs(t.amount));
    }
  }
  const totalSpend = [...catTotals.values()].reduce((a, b) => a + b, 0);
  const spendCats = [...catTotals.entries()]
    .map(([name, total]) => {
      const meta = catMeta(name);
      const budget = 'budget' in meta ? (meta as { budget?: number }).budget ?? 0 : 0;
      const budgetPct = budget > 0 ? Math.round((total / budget) * 100) : 0;
      return {
        name,
        total,
        totalStr: fmt(total),
        icon: meta.icon,
        color: meta.color,
        bg: meta.bg,
        pct: totalSpend > 0 ? Math.round((total / totalSpend) * 100) : 0,
        budget,
        budgetStr: budget > 0 ? fmt(budget) : null,
        budgetPct,
        overBudget: budget > 0 && total > budget,
      };
    })
    .sort((a, b) => b.total - a.total);
  const overBudgetCount = spendCats.filter(c => c.overBudget).length;

  // month navigation for the spending report: from the oldest txn month to now
  const txnMonths = state.txns.map(t => t.date.slice(0, 7));
  const minYM = txnMonths.length ? txnMonths.reduce((a, b) => (a < b ? a : b)) : currentYM;
  const shiftYM = (ym: string, delta: number) => {
    const [y, m] = ym.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };
  const prevSpendMonth = spendYM > minYM ? shiftYM(spendYM, -1) : null;
  const nextSpendMonth = spendYM < currentYM ? shiftYM(spendYM, 1) : null;
  const spendMonthLabel = `${MONTHS_PT[Number(spendYM.slice(5, 7)) - 1]} ${spendYM.slice(0, 4)}`;

  // comparison with the month before the one being viewed
  const prevYM = shiftYM(spendYM, -1);
  const monthSpendOf = (ym: string) => state.txns.reduce(
    (a, t) => (t.date.startsWith(ym) && t.amount < 0 && t.cat !== 'Transferência' ? a + Math.abs(t.amount) : a), 0);
  const prevTotalSpend = monthSpendOf(prevYM);
  const prevCatTotals = new Map<string, number>();
  for (const t of state.txns) {
    if (t.date.startsWith(prevYM) && t.amount < 0 && t.cat !== 'Transferência') {
      prevCatTotals.set(t.cat, (prevCatTotals.get(t.cat) || 0) + Math.abs(t.amount));
    }
  }
  const spendCatRows = spendCats.map(c => {
    const prev = prevCatTotals.get(c.name) || 0;
    const delta = prev > 0 ? Math.round((c.total / prev - 1) * 100) : null;
    return {
      ...c,
      deltaStr: delta === null || delta === 0 ? null : `${delta > 0 ? '↑' : '↓'} ${Math.abs(delta)}%`,
      deltaColor: delta !== null && delta > 0 ? 'var(--red)' : 'var(--green)',
    };
  });
  const spendDelta = prevTotalSpend > 0 ? Math.round((totalSpend / prevTotalSpend - 1) * 100) : null;
  const prevMonthName = MONTHS_PT[Number(prevYM.slice(5, 7)) - 1].toLowerCase();
  const spendDeltaStr = spendDelta === null || totalSpend === 0
    ? null
    : spendDelta === 0
      ? `mesmo total de ${prevMonthName}`
      : `${Math.abs(spendDelta)}% ${spendDelta > 0 ? 'a mais' : 'a menos'} que em ${prevMonthName}`;
  // spending less than last month is the good direction
  const spendDeltaColor = spendDelta !== null && spendDelta > 0 ? 'var(--red)' : 'var(--green)';

  // 6-month spend trend ending at the month being viewed
  const trendYMs = [-5, -4, -3, -2, -1, 0].map(d => shiftYM(spendYM, d));
  const trendMax = Math.max(...trendYMs.map(monthSpendOf), 1);
  const spendTrend = trendYMs.map(ym => {
    const total = monthSpendOf(ym);
    return {
      ym,
      label: MONTHS_PT[Number(ym.slice(5, 7)) - 1],
      total,
      totalStr: fmt(total),
      h: total > 0 ? Math.max((total / trendMax) * 100, 5) + '%' : '5%',
      selected: ym === spendYM,
      // only months inside the navigable range can be jumped to
      clickable: ym >= minYM && ym <= currentYM,
    };
  });
  const hasTrend = spendTrend.filter(m => m.total > 0).length >= 2;

  let accPct = 0;
  const donutSegs: string[] = [];
  for (const c of spendCats) {
    const from = accPct;
    accPct += totalSpend > 0 ? (c.total / totalSpend) * 100 : 0;
    donutSegs.push(`${c.color} ${from}% ${accPct}%`);
  }
  const donutBg = donutSegs.length
    ? `conic-gradient(${donutSegs.join(', ')})`
    : 'conic-gradient(var(--w7) 0 100%)';

  // net-worth history (auto-recorded monthly snapshots)
  const yd = state.yearData;
  const maxYear = yd.length ? Math.max(...yd.map(d => d.v)) : 0;
  const yearBars = yd.map((d, i) => {
    const last = i === yd.length - 1;
    return {
      m: d.m,
      h: (maxYear > 0 ? (d.v / maxYear) * 80 + 12 : 12) + '%',
      barBg: last ? 'linear-gradient(#34D399,#10B981)' : 'rgba(16,185,129,.4)',
      labelColor: last ? 'var(--green)' : 'var(--t4)',
    };
  });
  const hasHistory = yd.length >= 2;
  const prev = yd[yd.length - 2];
  const monthGrowth = hasHistory && prev.v > 0 ? (yd[yd.length - 1].v / prev.v - 1) * 100 : null;
  const monthGrowthStr = monthGrowth === null
    ? null
    : `${monthGrowth >= 0 ? '↑ +' : '↓ '}${monthGrowth.toFixed(1).replace('.', ',')}% este mês`;

  const goalsSaved = state.goals.reduce((a, b) => a + (b.saved || 0), 0);
  const goalsTarget = state.goals.reduce((a, b) => a + (b.target || 0), 0);

  const accById = new Map(state.accounts.map(a => [a.id, a]));
  const toTxnRow = (t: AppState['txns'][number]) => {
    const acc = t.accountId ? accById.get(t.accountId) : undefined;
    const toAcc = t.toAccountId ? accById.get(t.toAccountId) : undefined;
    const accLabel = t.cat === 'Transferência' && acc && toAcc
      ? ` · ${acc.name} → ${toAcc.name}`
      : acc ? ` · ${acc.name}` : '';
    return {
      id: t.id,
      icon: t.icon,
      desc: t.desc,
      cat: t.cat,
      sub: `${t.cat} · ${dateLabel(t.date)}${accLabel}`,
      date: t.date,
      amountStr: (t.amount < 0 ? '- ' : '+ ') + fmt(t.amount),
      color: t.amount < 0 ? 'var(--red)' : 'var(--green)',
      isExpense: t.amount < 0,
    };
  };

  return {
    hasMoney,
    patrimonioStr: fmt(patrimonio),
    netWorthStr: fmt(netWorth),
    dispTotalStr: fmt(dispTotal),
    reservaTotalStr: fmt(reservaTotal),
    investedTotalStr: fmt(investedTotal),
    cardBill,
    cardBillStr: fmt(cardBill),
    allocInvestW: (investedTotal / (patrimonio || 1)) * 100 + '%',
    allocReservaW: (reservaTotal / (patrimonio || 1)) * 100 + '%',
    allocDispW: (dispTotal / (patrimonio || 1)) * 100 + '%',
    balTotal: state.hidden ? 'R$ ••••••' : fmt(patrimonio),

    // month flow
    entrou, saiu, sobrou,
    entrouStr: fmt(entrou),
    saiuStr: fmt(saiu),
    sobrouStr: fmt(sobrou),
    hasTxns: state.txns.length > 0,

    // spending
    spendCats: spendCatRows,
    totalSpend,
    totalSpendStr: fmt(totalSpend),
    donutBg,
    homeTopCats: spendCats.slice(0, 3),
    overBudgetCount,
    spendYM,
    spendMonthLabel,
    prevSpendMonth,
    nextSpendMonth,
    spendDeltaStr,
    spendDeltaColor,
    spendTrend,
    hasTrend,
    isCurrentSpendMonth: spendYM === currentYM,
    budgetAmountStr: fmt(state.budgetCents / 100),
    recRows: state.recurrences.map(r => ({
      id: r.id,
      desc: r.desc,
      cat: r.cat,
      icon: r.icon,
      day: r.day,
      amountStr: (r.amount < 0 ? '- ' : '+ ') + fmt(r.amount),
      color: r.amount < 0 ? 'var(--red)' : 'var(--green)',
    })),

    // planner
    debtTotalStr: fmt(D),
    availStr: fmt(avail),
    investStr: fmt(investV),
    dailyStr: fmt(dailyV),
    salaryFmt: fmt(S),
    commitPct: commit + '%',
    commitColor: commit > 40 ? 'var(--red)' : commit > 30 ? 'var(--amber)' : 'var(--green)',
    commitMsg: commit > 40 ? 'Comprometimento alto — corte dívidas' : commit > 30 ? 'Dá pra melhorar um pouco' : 'Comprometimento saudável',
    barDebtW: w(D),
    barInvestW: w(investV),
    barDailyW: w(dailyV),

    // year history
    yearBars,
    hasHistory,
    monthGrowthStr,
    yearSavedStr: hasHistory ? fmt(yd[yd.length - 1].v - yd[0].v) : null,
    yearGrowthStr: hasHistory && yd[0].v > 0 ? '+' + Math.round((yd[yd.length - 1].v / yd[0].v - 1) * 100) + '%' : null,
    yearEndStr: yd.length ? fmt(yd[yd.length - 1].v) : fmt(patrimonio),
    yearFirstMonth: yd.length ? yd[0].m : null,

    // goals
    goalsSavedStr: fmt(goalsSaved),
    goalsTargetStr: fmt(goalsTarget),
    hasGoals: state.goals.length > 0,

    investRows: state.investments.map(iv => ({
      id: iv.id,
      name: iv.name,
      valueStr: fmt(iv.value),
      cls: Math.round((iv.value / (investedTotal || 1)) * 100) + '% · ' + iv.cls,
      ret: iv.ret,
      retColor: iv.good ? 'var(--green)' : 'var(--red)',
      color: iv.color,
    })),
    goalRows: state.goals.map(g => {
      const pc = Math.min(Math.round((g.saved / (g.target || 1)) * 100), 100);
      const missing = Math.max(g.target - g.saved, 0);
      // months from the current one to the deadline, inclusive
      let paceStr: string | null = null;
      let paceColor = 'var(--t4)';
      if (g.deadline) {
        const [dy, dm] = g.deadline.split('-').map(Number);
        const monthsLeft = (dy - now.getFullYear()) * 12 + (dm - (now.getMonth() + 1)) + 1;
        const deadlineLabel = `${MONTHS_PT[dm - 1]} ${dy}`;
        if (missing <= 0) {
          paceStr = 'Meta atingida 🎉';
          paceColor = 'var(--green)';
        } else if (monthsLeft <= 0) {
          paceStr = `Prazo vencido (${deadlineLabel}) — faltam ${fmt(missing)}`;
          paceColor = 'var(--red)';
        } else {
          paceStr = `Guarde ${fmt(missing / monthsLeft)}/mês até ${deadlineLabel}`;
          paceColor = 'var(--t3)';
        }
      } else if (missing <= 0 && g.target > 0) {
        paceStr = 'Meta atingida 🎉';
        paceColor = 'var(--green)';
      }
      return {
        id: g.id,
        icon: g.icon,
        name: g.name,
        sub: g.sub,
        color: g.color,
        pctStr: pc + '%',
        barW: pc + '%',
        savedStr: fmt(g.saved),
        targetStr: fmt(g.target),
        paceStr,
        paceColor,
      };
    }),
    accDisp: state.accounts.filter(a => a.group === 'disp').map(a => ({ id: a.id, icon: a.icon, name: a.name, bank: a.bank, valueStr: fmt(a.value) })),
    accReserva: state.accounts.filter(a => a.group === 'reserva').map(a => ({ id: a.id, icon: a.icon, name: a.name, bank: a.bank, valueStr: fmt(a.value) })),
    txnRows: state.txns.map(toTxnRow),

    amountStr: fmt(state.cents / 100),
    amountColor: state.addType === 'receita' ? 'var(--green)' : state.addType === 'transferencia' ? 'var(--amber)' : 'var(--red)',
    quickAmountStr: fmt(state.quickCents / 100),
    editAmountStr: fmt(state.editCents / 100),
    editAmount2Str: fmt(state.editCents2 / 100),
  };
}

export type Derived = ReturnType<typeof computeDerived>;
