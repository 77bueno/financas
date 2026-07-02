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

      <div className="screen-cols">
      <div className="screen-col">
      {/* evolução patrimônio */}
      <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 22, padding: '20px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, color: '#9C97B8' }}>Patrimônio hoje</span>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 26, color: '#fff', fontWeight: 600 }}>{derived.yearEndStr}</span>
          </div>
          {derived.yearGrowthStr && (
            <span style={{ background: 'rgba(110,231,176,.16)', color: '#6EE7B0', fontSize: 12.5, fontWeight: 600, padding: '5px 11px', borderRadius: 99 }}>↑ {derived.yearGrowthStr} no período</span>
          )}
        </div>
        {derived.yearBars.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, gap: 8 }}>
            {derived.yearBars.map((b, i) => (
              <div key={i} style={{ flex: 1, maxWidth: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: b.h, borderRadius: '7px 7px 3px 3px', background: b.barBg }} />
                <span style={{ fontSize: 10.5, color: b.labelColor }}>{b.m}</span>
              </div>
            ))}
          </div>
        )}
        {!derived.hasHistory && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(142,123,255,.08)', border: '1px solid rgba(142,123,255,.2)', borderRadius: 14, padding: 13, marginTop: 12 }}>
            <span style={{ fontSize: 16 }}>📅</span>
            <span style={{ fontSize: 12.5, color: '#C9C5DE', lineHeight: 1.5 }}>
              Registramos seu patrimônio automaticamente, mês a mês. Volte no mês que vem pra começar a ver a evolução.
            </span>
          </div>
        )}
      </div>
      </div>

      <div className="screen-col">
      {/* destaques */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <strong style={{ fontSize: 15, color: '#F3F1FF', fontWeight: 600 }}>Destaques</strong>
        <div style={{ display: 'flex', gap: 10 }}>
          {derived.yearSavedStr && (
            <div style={{ flex: 1, background: 'rgba(110,231,176,.10)', border: '1px solid rgba(110,231,176,.2)', borderRadius: 18, padding: 15 }}>
              <span style={{ fontSize: 11.5, color: '#6EE7B0' }}>💰 Patrimônio cresceu</span>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 19, color: '#fff', fontWeight: 600, marginTop: 4 }}>{derived.yearSavedStr}</div>
              <span style={{ fontSize: 11, color: '#7C7896' }}>desde {derived.yearFirstMonth}</span>
            </div>
          )}
          <div style={{ flex: 1, background: 'rgba(142,123,255,.10)', border: '1px solid rgba(142,123,255,.2)', borderRadius: 18, padding: 15 }}>
            <span style={{ fontSize: 11.5, color: '#B9A6FF' }}>📈 Investido</span>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 19, color: '#fff', fontWeight: 600, marginTop: 4 }}>{derived.investedTotalStr}</div>
            <span style={{ fontSize: 11, color: '#7C7896' }}>na carteira</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: 15 }}>
            <span style={{ fontSize: 11.5, color: '#9C97B8' }}>🐷 Guardado em metas</span>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 19, color: '#fff', fontWeight: 600, marginTop: 4 }}>{derived.goalsSavedStr}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: 15 }}>
            <span style={{ fontSize: 11.5, color: '#9C97B8' }}>🧾 Gasto registrado</span>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 19, color: '#fff', fontWeight: 600, marginTop: 4 }}>{derived.totalSpendStr}</div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
