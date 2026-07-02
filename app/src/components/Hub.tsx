import { useFinance } from '../state/store';

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 15, cursor: 'pointer',
  fontFamily: "'Sora'", textAlign: 'left', width: '100%',
};

const iconWrap = (bg: string): React.CSSProperties => ({
  width: 42, height: 42, borderRadius: 12, background: bg,
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19,
});

export function Hub() {
  const { state, actions } = useFinance();
  if (!state.hubOpen) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
      <div
        onClick={actions.closeHub}
        style={{ position: 'absolute', inset: 0, background: 'rgba(4,2,12,.6)', backdropFilter: 'blur(2px)', animation: 'fadeIn .2s both' }}
      />
      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, background: '#15112b',
          borderRadius: '28px 28px 41px 41px', borderTop: '1px solid rgba(255,255,255,.1)',
          padding: '12px 22px 30px', animation: 'sheetUp .28s cubic-bezier(.22,1,.36,1) both',
        }}
      >
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,.2)', borderRadius: 99, margin: '0 auto 16px' }} />
        <strong style={{ fontSize: 17, color: '#fff', fontWeight: 600, display: 'block', marginBottom: 16 }}>
          O que você quer adicionar?
        </strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={actions.addTxn} style={rowStyle}>
            <div style={iconWrap('rgba(255,143,179,.16)')}>💸</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>Transação</div>
              <div style={{ fontSize: 11.5, color: '#9C97B8' }}>Registrar um gasto ou receita</div>
            </div>
            <span style={{ color: '#7C7896', fontSize: 18 }}>›</span>
          </button>
          <button onClick={() => actions.openQuick('conta')} style={rowStyle}>
            <div style={iconWrap('rgba(142,123,255,.16)')}>🏦</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>Conta</div>
              <div style={{ fontSize: 11.5, color: '#9C97B8' }}>Onde você guarda dinheiro</div>
            </div>
            <span style={{ color: '#7C7896', fontSize: 18 }}>›</span>
          </button>
          <button onClick={() => actions.openQuick('cofrinho')} style={rowStyle}>
            <div style={iconWrap('rgba(110,231,176,.16)')}>🐷</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>Cofrinho / meta</div>
              <div style={{ fontSize: 11.5, color: '#9C97B8' }}>Um objetivo pra guardar</div>
            </div>
            <span style={{ color: '#7C7896', fontSize: 18 }}>›</span>
          </button>
          <button onClick={() => actions.openQuick('investimento')} style={rowStyle}>
            <div style={iconWrap('rgba(232,185,106,.16)')}>📈</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>Investimento</div>
              <div style={{ fontSize: 11.5, color: '#9C97B8' }}>Um aporte na sua carteira</div>
            </div>
            <span style={{ color: '#7C7896', fontSize: 18 }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
