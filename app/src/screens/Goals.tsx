import { useFinance } from '../state/store';

export function Goals() {
  const { actions, derived } = useFinance();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, color: '#9C97B8', letterSpacing: '.04em' }}>COFRINHOS & METAS</span>
        <strong style={{ fontSize: 22, color: '#F3F1FF', fontWeight: 700 }}>Meus objetivos</strong>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(142,123,255,.12)', border: '1px solid rgba(142,123,255,.25)', borderRadius: 18, padding: 15 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(142,123,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🐷</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: '#C9C5DE' }}>Guardado este mês</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 17, color: '#fff', fontWeight: 600 }}>R$ 640</div>
        </div>
        <span style={{ fontSize: 12, color: '#6EE7B0' }}>↑ +18%</span>
      </div>

      <div className="grid-2">
        {derived.goalRows.map(g => (
          <div key={g.id} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(142,123,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>{g.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: 11.5, color: '#7C7896' }}>{g.sub}</div>
              </div>
              <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13, color: '#B9A6FF', fontWeight: 600 }}>{g.pctStr}</span>
            </div>
            <div style={{ height: 9, background: 'rgba(255,255,255,.08)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: g.barW, height: '100%', background: 'linear-gradient(90deg,#8E7BFF,#B9A6FF)', borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
              <span style={{ color: '#C9C5DE', fontFamily: "'Space Grotesk'" }}>{g.savedStr}</span>
              <span style={{ color: '#7C7896' }}>de {g.targetStr}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => actions.openQuick('cofrinho')}
        style={{ width: '100%', padding: 14, background: 'rgba(255,255,255,.05)', border: '1px dashed rgba(255,255,255,.2)', borderRadius: 16, color: '#B9A6FF', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'" }}
      >
        + Criar novo cofrinho
      </button>
    </div>
  );
}
