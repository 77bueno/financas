import { useFinance } from '../state/store';
import { Icon } from './Icon';

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 15, cursor: 'pointer',
  fontFamily: "'Inter'", textAlign: 'left', width: '100%',
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
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(2px)', animation: 'fadeIn .2s both' }}
      />
      <div
        className="sheet"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, background: '#14171C',
          borderRadius: '28px 28px 41px 41px', borderTop: '1px solid rgba(255,255,255,.1)',
          padding: '12px 22px calc(30px + env(safe-area-inset-bottom))', animation: 'sheetUp .28s cubic-bezier(.22,1,.36,1) both',
        }}
      >
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,.2)', borderRadius: 99, margin: '0 auto 16px' }} />
        <strong style={{ fontSize: 17, color: '#fff', fontWeight: 600, display: 'block', marginBottom: 16 }}>
          O que você quer adicionar?
        </strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={actions.addTxn} style={rowStyle}>
            <div style={{ ...iconWrap('rgba(248,113,113,.14)'), color: '#F87171' }}><Icon name="coins" size={20} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600 }}>Transação</div>
              <div style={{ fontSize: 11.5, color: '#9AA3AF' }}>Registrar um gasto ou receita</div>
            </div>
            <span style={{ color: '#6B7280', fontSize: 18 }}>›</span>
          </button>
          <button onClick={() => actions.openQuick('conta')} style={rowStyle}>
            <div style={{ ...iconWrap('rgba(56,189,248,.14)'), color: '#38BDF8' }}><Icon name="bank" size={20} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600 }}>Conta</div>
              <div style={{ fontSize: 11.5, color: '#9AA3AF' }}>Onde você guarda dinheiro</div>
            </div>
            <span style={{ color: '#6B7280', fontSize: 18 }}>›</span>
          </button>
          <button onClick={() => actions.openQuick('cofrinho')} style={rowStyle}>
            <div style={{ ...iconWrap('rgba(52,211,153,.14)'), color: '#34D399' }}><Icon name="piggy" size={20} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600 }}>Cofrinho / meta</div>
              <div style={{ fontSize: 11.5, color: '#9AA3AF' }}>Um objetivo pra guardar</div>
            </div>
            <span style={{ color: '#6B7280', fontSize: 18 }}>›</span>
          </button>
          <button onClick={() => actions.openQuick('investimento')} style={rowStyle}>
            <div style={{ ...iconWrap('rgba(251,191,36,.14)'), color: '#FBBF24' }}><Icon name="trend" size={20} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600 }}>Investimento</div>
              <div style={{ fontSize: 11.5, color: '#9AA3AF' }}>Um aporte na sua carteira</div>
            </div>
            <span style={{ color: '#6B7280', fontSize: 18 }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
