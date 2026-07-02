import { useFinance } from '../state/store';

export function Year() {
  const { actions, derived } = useFinance();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={actions.goHome} style={{ background: 'rgba(255,255,255,.06)', border: 'none', width: 34, height: 34, borderRadius: 11, color: '#C9C5DE', fontSize: 16, cursor: 'pointer' }}>‹</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12, color: '#9C97B8', letterSpacing: '.04em' }}>O QUE MUDOU</span>
          <strong style={{ fontSize: 20, color: '#F3F1FF', fontWeight: 700 }}>Seu ano até aqui</strong>
        </div>
      </div>

      {/* evolução patrimônio */}
      <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 22, padding: '20px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, color: '#9C97B8' }}>Patrimônio hoje</span>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 26, color: '#fff', fontWeight: 600 }}>{derived.yearEndStr}</span>
          </div>
          <span style={{ background: 'rgba(110,231,176,.16)', color: '#6EE7B0', fontSize: 12.5, fontWeight: 600, padding: '5px 11px', borderRadius: 99 }}>↑ {derived.yearGrowthStr} no ano</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, gap: 8 }}>
          {derived.yearBars.map((b, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', height: b.h, borderRadius: '7px 7px 3px 3px', background: b.barBg }} />
              <span style={{ fontSize: 10.5, color: b.labelColor }}>{b.m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* destaques do ano */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <strong style={{ fontSize: 15, color: '#F3F1FF', fontWeight: 600 }}>Destaques</strong>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: 'rgba(110,231,176,.10)', border: '1px solid rgba(110,231,176,.2)', borderRadius: 18, padding: 15 }}>
            <span style={{ fontSize: 11.5, color: '#6EE7B0' }}>💰 Você guardou</span>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 19, color: '#fff', fontWeight: 600, marginTop: 4 }}>{derived.yearSavedStr}</div>
            <span style={{ fontSize: 11, color: '#7C7896' }}>desde janeiro</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(142,123,255,.10)', border: '1px solid rgba(142,123,255,.2)', borderRadius: 18, padding: 15 }}>
            <span style={{ fontSize: 11.5, color: '#B9A6FF' }}>📈 Investido</span>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 19, color: '#fff', fontWeight: 600, marginTop: 4 }}>{derived.investedTotalStr}</div>
            <span style={{ fontSize: 11, color: '#7C7896' }}>na carteira</span>
          </div>
        </div>
      </div>

      {/* variações */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <strong style={{ fontSize: 15, color: '#F3F1FF', fontWeight: 600 }}>O que mudou no ano</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: 13 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(110,231,176,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>📈</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, color: '#F3F1FF', fontWeight: 500 }}>Investimentos cresceram</div>
              <div style={{ fontSize: 11, color: '#7C7896' }}>mais aportes + rendimento</div>
            </div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#6EE7B0', fontWeight: 600 }}>+R$ 9.410</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: 13 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(110,231,176,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🐷</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, color: '#F3F1FF', fontWeight: 500 }}>Reserva reforçada</div>
              <div style={{ fontSize: 11, color: '#7C7896' }}>de 30% para 45% da meta</div>
            </div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#6EE7B0', fontWeight: 600 }}>+R$ 2.100</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: 13 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,143,179,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🍽️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, color: '#F3F1FF', fontWeight: 500 }}>Gasto com alimentação caiu</div>
              <div style={{ fontSize: 11, color: '#7C7896' }}>média mensal menor</div>
            </div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#6EE7B0', fontWeight: 600 }}>-8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
