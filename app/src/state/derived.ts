import type { AppState, Category } from './types';
import { fmt, dateLabel } from '../utils/format';

const FALLBACK_CAT: Omit<Category, 'id' | 'name'> = { icon: '💸', color: '#5E4BA0', bg: 'rgba(94,75,160,.16)' };

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

  // current month scope
  const now = new Date();
  const ymPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthTxns = state.txns.filter(t => t.date.startsWith(ymPrefix));

  // month flow from this month's transactions; transfers between own
  // accounts move money around but don't enter or leave
  const flowTxns = monthTxns.filter(t => t.cat !== 'Transferência');
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
      return {
        name,
        total,
        totalStr: fmt(total),
        icon: meta.icon,
        color: meta.color,
        bg: meta.bg,
        pct: totalSpend > 0 ? Math.round((total / totalSpend) * 100) : 0,
      };
    })
    .sort((a, b) => b.total - a.total);

  let accPct = 0;
  const donutSegs: string[] = [];
  for (const c of spendCats) {
    const from = accPct;
    accPct += totalSpend > 0 ? (c.total / totalSpend) * 100 : 0;
    donutSegs.push(`${c.color} ${from}% ${accPct}%`);
  }
  const donutBg = donutSegs.length
    ? `conic-gradient(${donutSegs.join(', ')})`
    : 'conic-gradient(rgba(255,255,255,.07) 0 100%)';

  // net-worth history (auto-recorded monthly snapshots)
  const yd = state.yearData;
  const maxYear = yd.length ? Math.max(...yd.map(d => d.v)) : 0;
  const yearBars = yd.map((d, i) => {
    const last = i === yd.length - 1;
    return {
      m: d.m,
      h: (maxYear > 0 ? (d.v / maxYear) * 80 + 12 : 12) + '%',
      barBg: last ? 'linear-gradient(#B9A6FF,#8E7BFF)' : 'rgba(142,123,255,.4)',
      labelColor: last ? '#B9A6FF' : '#7C7896',
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
      color: t.amount < 0 ? '#FF8FB3' : '#6EE7B0',
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
    spendCats,
    totalSpend,
    totalSpendStr: fmt(totalSpend),
    donutBg,
    homeTopCats: spendCats.slice(0, 3),

    // planner
    debtTotalStr: fmt(D),
    availStr: fmt(avail),
    investStr: fmt(investV),
    dailyStr: fmt(dailyV),
    salaryFmt: fmt(S),
    commitPct: commit + '%',
    commitColor: commit > 40 ? '#FF8FB3' : commit > 30 ? '#E8B96A' : '#6EE7B0',
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
      retColor: iv.good ? '#6EE7B0' : '#FF8FB3',
      color: iv.color,
    })),
    goalRows: state.goals.map(g => {
      const pc = Math.min(Math.round((g.saved / (g.target || 1)) * 100), 100);
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
      };
    }),
    accDisp: state.accounts.filter(a => a.group === 'disp').map(a => ({ id: a.id, icon: a.icon, name: a.name, bank: a.bank, valueStr: fmt(a.value) })),
    accReserva: state.accounts.filter(a => a.group === 'reserva').map(a => ({ id: a.id, icon: a.icon, name: a.name, bank: a.bank, valueStr: fmt(a.value) })),
    txnRows: state.txns.map(toTxnRow),

    amountStr: fmt(state.cents / 100),
    amountColor: state.addType === 'receita' ? '#6EE7B0' : state.addType === 'transferencia' ? '#E8B96A' : '#FF8FB3',
    quickAmountStr: fmt(state.quickCents / 100),
    editAmountStr: fmt(state.editCents / 100),
    editAmount2Str: fmt(state.editCents2 / 100),
  };
}

export type Derived = ReturnType<typeof computeDerived>;
