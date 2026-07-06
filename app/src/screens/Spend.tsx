import { useFinance } from '../state/store';
import { Icon } from '../components/Icon';

const navBtn = (enabled: boolean): React.CSSProperties => ({
  width: 32, height: 32, borderRadius: 9, border: '1px solid var(--w10)',
  background: 'var(--w5)', color: enabled ? 'var(--t2)' : 'var(--t6)',
  cursor: enabled ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center',
});

export function Spend() {
  const { actions, derived } = useFinance();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 12, color: 'var(--t3)', letterSpacing: '.04em' }}>ONDE GASTEI</span>
          <strong style={{ fontSize: 22, color: 'var(--t1)', fontWeight: 700 }}>{derived.spendMonthLabel}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => derived.prevSpendMonth && actions.setSpendMonth(derived.prevSpendMonth)}
            disabled={!derived.prevSpendMonth}
            style={navBtn(!!derived.prevSpendMonth)}
            title="Mês anterior"
          >
            <Icon name="back" size={15} />
          </button>
          <button
            onClick={() => actions.setSpendMonth(derived.nextSpendMonth)}
            disabled={!derived.nextSpendMonth}
            style={navBtn(!!derived.nextSpendMonth)}
            title="Mês seguinte"
          >
            <Icon name="back" size={15} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button onClick={actions.goTxns} style={{ background: 'none', border: 'none', fontSize: 12.5, color: 'var(--green)', cursor: 'pointer', fontFamily: "'Inter'" }}>extrato ›</button>
        </div>
      </div>

      {derived.overBudgetCount > 0 && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 12, padding: '11px 14px' }}>
          <span style={{ color: 'var(--red)', display: 'flex' }}><Icon name="pie" size={16} /></span>
          <span style={{ fontSize: 12.5, color: 'var(--red2)' }}>
            {derived.overBudgetCount === 1 ? '1 categoria estourou o orçamento' : `${derived.overBudgetCount} categorias estouraram o orçamento`} este mês.
          </span>
        </div>
      )}

      {derived.totalSpend > 0 ? (
        <div className="screen-cols">
        <div className="screen-col">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
          <div
            style={{
              position: 'relative', width: 190, height: 190, borderRadius: '50%',
              background: derived.donutBg,
            }}
          >
            <div style={{ position: 'absolute', inset: 26, borderRadius: '50%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>Total gasto</span>
              <span style={{ fontFamily: "'Space Grotesk'", fontSize: 24, fontWeight: 600, color: 'var(--t1)' }}>{derived.totalSpendStr}</span>
              <span style={{ fontSize: 11, color: 'var(--t4)' }}>{derived.spendCats.length} categoria{derived.spendCats.length === 1 ? '' : 's'}</span>
            </div>
          </div>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--t4)', textAlign: 'center' }}>Toque numa categoria pra definir um orçamento mensal.</span>
        </div>

        <div className="screen-col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {derived.spendCats.map(c => (
            <button
              key={c.name}
              onClick={() => actions.openBudget(c.name)}
              style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: 'var(--w4)', border: '1px solid var(--w6)', borderRadius: 14, cursor: 'pointer', fontFamily: "'Inter'", textAlign: 'left', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: 'var(--t1)', fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--t4)' }}>{c.pct}% dos gastos{c.budgetStr ? ` · orçamento ${c.budgetStr}` : ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Space Grotesk'", fontSize: 14, color: 'var(--t1)', fontWeight: 600 }}>{c.totalStr}</div>
                  {c.budget > 0 && (
                    <div style={{ fontSize: 11, color: c.overBudget ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>
                      {c.overBudget ? `estourou · ${c.budgetPct}%` : `${c.budgetPct}% do limite`}
                    </div>
                  )}
                </div>
              </div>
              {c.budget > 0 && (
                <div style={{ height: 5, background: 'var(--w7)', borderRadius: 99, overflow: 'hidden', width: '100%' }}>
                  <div style={{ width: `${Math.min(c.budgetPct, 100)}%`, height: '100%', background: c.overBudget ? 'var(--red)' : 'var(--green)', borderRadius: 99 }} />
                </div>
              )}
            </button>
          ))}
        </div>
        </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ width: 70, height: 70, borderRadius: 22, background: 'rgba(248,113,113,.1)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="pie" size={30} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <strong style={{ fontSize: 16, color: 'var(--t1)' }}>Nenhum gasto em {derived.spendMonthLabel}</strong>
            <span style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5 }}>
              {derived.isCurrentSpendMonth
                ? 'Registre seus gastos e este relatório mostra pra onde seu dinheiro está indo, por categoria.'
                : 'Não há lançamentos neste mês. Use as setas pra navegar.'}
            </span>
          </div>
          {derived.isCurrentSpendMonth && (
            <button
              onClick={actions.openAdd}
              style={{ padding: '13px 22px', background: '#10B981', border: 'none', borderRadius: 12, color: '#04120C', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
            >
              + Registrar um gasto
            </button>
          )}
        </div>
      )}
    </div>
  );
}
