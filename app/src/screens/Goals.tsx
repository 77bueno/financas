import { useFinance } from '../state/store';

export function Goals() {
  const { actions, derived } = useFinance();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, color: 'var(--t3)', letterSpacing: '.04em' }}>COFRINHOS & METAS</span>
        <strong style={{ fontSize: 22, color: 'var(--t1)', fontWeight: 700 }}>Meus objetivos</strong>
      </div>

      {derived.hasGoals && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 18, padding: 15 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(16,185,129,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🐷</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--t2)' }}>Total guardado</div>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 17, color: 'var(--t1)', fontWeight: 600 }}>{derived.goalsSavedStr}</div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>de {derived.goalsTargetStr}</span>
        </div>
      )}

      {derived.hasGoals ? (
        <div className="grid-2">
          {derived.goalRows.map(g => (
            <button
              key={g.id}
              onClick={() => actions.openEditItem('cofrinho', g.id)}
              style={{ background: 'var(--w4)', border: '1px solid var(--w7)', borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', gap: 13, cursor: 'pointer', fontFamily: "'Inter'", textAlign: 'left', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(16,185,129,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>{g.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, color: 'var(--t1)', fontWeight: 600 }}>{g.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--t4)' }}>{g.sub}</div>
                </div>
                <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>{g.pctStr}</span>
              </div>
              <div style={{ height: 9, background: 'var(--w8)', borderRadius: 99, overflow: 'hidden', width: '100%' }}>
                <div style={{ width: g.barW, height: '100%', background: 'linear-gradient(90deg,#10B981,#34D399)', borderRadius: 99 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, width: '100%' }}>
                <span style={{ color: 'var(--t2)', fontFamily: "'Space Grotesk'" }}>{g.savedStr}</span>
                <span style={{ color: 'var(--t4)' }}>de {g.targetStr}</span>
              </div>
              {g.paceStr && (
                <span style={{ fontSize: 11.5, color: g.paceColor, fontWeight: 600 }}>{g.paceStr}</span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 20px', textAlign: 'center' }}>
          <div style={{ width: 70, height: 70, borderRadius: 22, background: 'rgba(52,211,153,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🐷</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <strong style={{ fontSize: 16, color: 'var(--t1)' }}>Nenhum objetivo ainda</strong>
            <span style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5 }}>Crie cofrinhos pra guardar dinheiro com propósito: uma viagem, reserva de emergência, um celular novo…</span>
          </div>
        </div>
      )}

      <button
        onClick={() => actions.openQuick('cofrinho')}
        style={{ width: '100%', padding: 14, background: 'var(--w5)', border: '1px dashed var(--w20)', borderRadius: 16, color: 'var(--green)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
      >
        + Criar novo cofrinho
      </button>
    </div>
  );
}
