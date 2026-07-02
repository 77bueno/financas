import type { AppState } from './types';
import { fmt } from '../utils/format';

export function computeDerived(state: AppState) {
  const S = state.salary;
  const D = state.debts.reduce((a, b) => a + (b.value || 0), 0);
  const avail = Math.max(S - D, 0);
  const pct = state.investPct;
  const investV = (avail * pct) / 100;
  const dailyV = avail - investV;
  const commit = S > 0 ? Math.round((D / S) * 100) : 0;
  const w = (v: number) => (S > 0 ? (v / S) * 100 : 0) + '%';

  const cardBill = 1180;
  const dispTotal = state.accounts.filter(a => a.group === 'disp').reduce((a, b) => a + (b.value || 0), 0);
  const reservaTotal = state.accounts.filter(a => a.group === 'reserva').reduce((a, b) => a + (b.value || 0), 0);
  const investedTotal = state.investments.reduce((a, b) => a + (b.value || 0), 0);
  const patrimonio = dispTotal + reservaTotal + investedTotal;
  const netWorth = patrimonio - cardBill;

  const yd = state.yearData;
  const maxYear = Math.max(...yd.map(d => d.v));
  const yearBars = yd.map((d, i) => {
    const last = i === yd.length - 1;
    return {
      m: d.m,
      h: (d.v / maxYear) * 80 + 12 + '%',
      barBg: last ? 'linear-gradient(#B9A6FF,#8E7BFF)' : 'rgba(142,123,255,.4)',
      labelColor: last ? '#B9A6FF' : '#7C7896',
    };
  });

  return {
    S, D, avail, pct, investV, dailyV, commit, w,
    cardBill,
    dispTotal, reservaTotal, investedTotal, patrimonio, netWorth,
    patrimonioStr: fmt(patrimonio),
    netWorthStr: fmt(netWorth),
    dispTotalStr: fmt(dispTotal),
    reservaTotalStr: fmt(reservaTotal),
    investedTotalStr: fmt(investedTotal),
    cardBillStr: fmt(cardBill),
    allocInvestW: (investedTotal / (patrimonio || 1)) * 100 + '%',
    allocReservaW: (reservaTotal / (patrimonio || 1)) * 100 + '%',
    allocDispW: (dispTotal / (patrimonio || 1)) * 100 + '%',
    balTotal: state.hidden ? 'R$ ••••••' : fmt(patrimonio),
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
    yearBars,
    yearSavedStr: fmt(yd[yd.length - 1].v - yd[0].v),
    yearGrowthStr: '+' + Math.round((yd[yd.length - 1].v / yd[0].v - 1) * 100) + '%',
    yearEndStr: fmt(yd[yd.length - 1].v),
    yearStartStr: fmt(yd[0].v),
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
    txnRows: state.txns.map(t => ({
      id: t.id,
      icon: t.icon,
      name: t.name,
      sub: t.sub,
      amountStr: (t.amount < 0 ? '- ' : '+ ') + fmt(t.amount),
      color: t.amount < 0 ? '#FF8FB3' : '#6EE7B0',
    })),
    amountStr: fmt(state.cents / 100),
    amountColor: state.addType === 'receita' ? '#6EE7B0' : state.addType === 'transferencia' ? '#E8B96A' : '#FF8FB3',
    quickAmountStr: fmt(state.quickCents / 100),
  };
}

export type Derived = ReturnType<typeof computeDerived>;
