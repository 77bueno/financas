import { useFinance } from '../state/store';

export function Invest() {
  const { actions, derived } = useFinance();
  const n = derived.investRows.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em' }}>ONDE INVESTI</span>
        <strong style={{ fontSize: 22, color: '#EDEFF2', fontWeight: 700 }}>Meus investimentos</strong>
      </div>

      <div className="screen-cols">
      <div className="screen-col">
      <div
        style={{
          position: 'relative', background: 'linear-gradient(150deg, rgba(251,191,36,.18), rgba(16,185,129,.10))',
          border: '1px solid rgba(255,255,255,.1)', borderRadius: 24, padding: 20, overflow: 'hidden',
        }}
      >
        <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)', position: 'relative' }}>Total investido</span>
        <div style={{ fontFamily: "'Space Grotesk'", fontSize: 32, fontWeight: 600, color: '#fff', marginTop: 4, position: 'relative' }}>{derived.investedTotalStr}</div>
        {n > 0 && (
          <div style={{ display: 'flex', gap: 10, marginTop: 10, position: 'relative' }}>
            <span style={{ background: 'rgba(255,255,255,.08)', color: '#C3C9D2', fontSize: 12, padding: '4px 10px', borderRadius: 99 }}>{n} ativo{n === 1 ? '' : 's'} na carteira</span>
          </div>
        )}
      </div>
      </div>

      <div className="screen-col">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <strong style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600 }}>Carteira</strong>
        {n > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {derived.investRows.map(iv => (
              <button
                key={iv.id}
                onClick={() => actions.openEditItem('investimento', iv.id)}
                style={{ background: 'rgba(255,255,255,.04)', border: 'none', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 9, cursor: 'pointer', fontFamily: "'Inter'", width: '100%', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: iv.color }} />
                    <span style={{ fontSize: 13.5, color: '#EDEFF2', fontWeight: 500 }}>{iv.name}</span>
                  </div>
                  <span style={{ fontFamily: "'Space Grotesk'", fontSize: 14, color: '#fff', fontWeight: 600 }}>{iv.valueStr}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: 11.5, color: '#6B7280' }}>{iv.cls}</span>
                  <span style={{ fontSize: 11.5, color: iv.retColor }}>{iv.ret}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', textAlign: 'center', padding: '18px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 18 }}>
            <span style={{ fontSize: 28 }}>📈</span>
            <span style={{ fontSize: 13, color: '#9AA3AF', lineHeight: 1.5 }}>Sua carteira está vazia. Adicione o que você já tem investido — Tesouro, CDB, ações, cripto…</span>
          </div>
        )}
        <button
          onClick={() => actions.openQuick('investimento')}
          style={{ width: '100%', padding: 14, background: 'rgba(255,255,255,.05)', border: '1px dashed rgba(255,255,255,.2)', borderRadius: 16, color: '#34D399', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
        >
          + Adicionar investimento
        </button>
      </div>
      </div>
      </div>
    </div>
  );
}
