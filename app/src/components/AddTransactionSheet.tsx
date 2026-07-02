import { useFinance } from '../state/store';
import { CAT_LIST, CAT_ICONS } from '../state/constants';
import { Keypad } from './Keypad';

const segBtnStyle: React.CSSProperties = {
  flex: 1, border: 'none', padding: 9, borderRadius: 10, fontSize: 13, fontWeight: 600,
  cursor: 'pointer', fontFamily: "'Sora'",
};

export function AddTransactionSheet() {
  const { state, actions, derived } = useFinance();
  if (!state.addOpen) return null;

  const seg = {
    despesa: { bg: state.addType === 'despesa' ? '#8E7BFF' : 'transparent', color: state.addType === 'despesa' ? '#fff' : '#9C97B8' },
    receita: { bg: state.addType === 'receita' ? '#6EE7B0' : 'transparent', color: state.addType === 'receita' ? '#08321f' : '#9C97B8' },
    transferencia: { bg: state.addType === 'transferencia' ? '#E8B96A' : 'transparent', color: state.addType === 'transferencia' ? '#3a2b06' : '#9C97B8' },
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
      <div
        onClick={actions.closeAdd}
        style={{ position: 'absolute', inset: 0, background: 'rgba(4,2,12,.6)', backdropFilter: 'blur(2px)', animation: 'fadeIn .2s both' }}
      />
      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, background: '#15112b',
          borderRadius: '28px 28px 41px 41px', borderTop: '1px solid rgba(255,255,255,.1)',
          padding: '12px 22px calc(30px + env(safe-area-inset-bottom))', animation: 'sheetUp .28s cubic-bezier(.22,1,.36,1) both',
        }}
      >
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,.2)', borderRadius: 99, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <strong style={{ fontSize: 17, color: '#fff', fontWeight: 600 }}>Nova transação</strong>
          <button
            onClick={actions.closeAdd}
            style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#C9C5DE', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,.05)', borderRadius: 14, padding: 4, gap: 4, marginBottom: 18 }}>
          <button onClick={() => actions.setAddType('despesa')} style={{ ...segBtnStyle, background: seg.despesa.bg, color: seg.despesa.color }}>Despesa</button>
          <button onClick={() => actions.setAddType('receita')} style={{ ...segBtnStyle, background: seg.receita.bg, color: seg.receita.color }}>Receita</button>
          <button onClick={() => actions.setAddType('transferencia')} style={{ ...segBtnStyle, background: seg.transferencia.bg, color: seg.transferencia.color }}>Transferência</button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: '#9C97B8' }}>Valor</span>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 42, fontWeight: 600, color: derived.amountColor, letterSpacing: '-.02em' }}>
            {derived.amountStr}
          </div>
        </div>

        <div className="fin-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, marginBottom: 16 }}>
          {CAT_LIST.map(name => {
            const sel = state.addCat === name;
            return (
              <button
                key={name}
                onClick={() => actions.setAddCat(name)}
                style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                  border: `1px solid ${sel ? '#8E7BFF' : 'rgba(255,255,255,.08)'}`,
                  background: sel ? 'rgba(142,123,255,.25)' : 'rgba(255,255,255,.04)',
                  color: sel ? '#fff' : '#C9C5DE',
                  padding: '8px 13px', borderRadius: 99, fontSize: 12.5, cursor: 'pointer',
                  fontFamily: "'Sora'", fontWeight: 500,
                }}
              >
                {CAT_ICONS[name]} {name}
              </button>
            );
          })}
        </div>

        <Keypad onDigit={actions.press} onBackspace={actions.backspace} />

        <button
          onClick={actions.save}
          style={{
            width: '100%', padding: 15, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)', border: 'none',
            borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'",
            boxShadow: '0 10px 24px -6px rgba(142,123,255,.6)',
          }}
        >
          Salvar transação
        </button>
      </div>
    </div>
  );
}
