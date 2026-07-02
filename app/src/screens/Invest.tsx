import { useFinance } from '../state/store';

export function Invest() {
  const { derived } = useFinance();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, color: '#9C97B8', letterSpacing: '.04em' }}>ONDE INVESTI</span>
        <strong style={{ fontSize: 22, color: '#F3F1FF', fontWeight: 700 }}>Meus investimentos</strong>
      </div>

      <div
        style={{
          position: 'relative', background: 'linear-gradient(150deg, rgba(232,185,106,.18), rgba(142,123,255,.10))',
          border: '1px solid rgba(255,255,255,.1)', borderRadius: 24, padding: 20, overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -30, width: 150, height: 150, background: 'radial-gradient(circle,#E8B96A,transparent 70%)', opacity: 0.35 }} />
        <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)', position: 'relative' }}>Total investido</span>
        <div style={{ fontFamily: "'Space Grotesk'", fontSize: 32, fontWeight: 600, color: '#fff', marginTop: 4, position: 'relative' }}>{derived.investedTotalStr}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, position: 'relative' }}>
          <span style={{ background: 'rgba(110,231,176,.16)', color: '#6EE7B0', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 99 }}>↑ +R$ 1.890 (5,6%)</span>
          <span style={{ background: 'rgba(255,255,255,.08)', color: '#C9C5DE', fontSize: 12, padding: '4px 10px', borderRadius: 99 }}>no ano</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <strong style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>Carteira</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {derived.investRows.map(iv => (
            <div key={iv.id} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: iv.color }} />
                  <span style={{ fontSize: 13.5, color: '#F3F1FF', fontWeight: 500 }}>{iv.name}</span>
                </div>
                <span style={{ fontFamily: "'Space Grotesk'", fontSize: 14, color: '#fff', fontWeight: 600 }}>{iv.valueStr}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11.5, color: '#7C7896' }}>{iv.cls}</span>
                <span style={{ fontSize: 11.5, color: iv.retColor }}>{iv.ret}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
