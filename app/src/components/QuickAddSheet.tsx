import { useFinance } from '../state/store';
import { QUICK_TITLE, QUICK_VAL_LABEL, QUICK_PLACEHOLDER } from '../state/constants';
import { Keypad } from './Keypad';

export function QuickAddSheet() {
  const { state, actions, derived } = useFinance();
  if (!state.quickOpen) return null;

  const kind = state.quickKind ?? '';

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 21 }}>
      <div
        onClick={actions.closeQuick}
        style={{ position: 'absolute', inset: 0, background: 'rgba(4,2,12,.6)', backdropFilter: 'blur(2px)', animation: 'fadeIn .2s both' }}
      />
      <div
        className="sheet"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, background: '#15112b',
          borderRadius: '28px 28px 41px 41px', borderTop: '1px solid rgba(255,255,255,.1)',
          padding: '12px 22px calc(30px + env(safe-area-inset-bottom))', animation: 'sheetUp .28s cubic-bezier(.22,1,.36,1) both',
        }}
      >
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,.2)', borderRadius: 99, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <strong style={{ fontSize: 17, color: '#fff', fontWeight: 600 }}>{QUICK_TITLE[kind] ?? ''}</strong>
          <button
            onClick={actions.closeQuick}
            style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#C9C5DE', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <input
          value={state.quickName}
          onChange={e => actions.setQuickName(e.target.value)}
          placeholder={QUICK_PLACEHOLDER[kind] ?? 'Nome'}
          style={{
            width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 14, padding: '13px 15px', color: '#fff', fontFamily: "'Sora'", fontSize: 14,
            outline: 'none', marginBottom: 16,
          }}
        />

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: '#9C97B8' }}>{QUICK_VAL_LABEL[kind] ?? 'Valor'}</span>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 40, fontWeight: 600, color: '#fff', letterSpacing: '-.02em' }}>
            {derived.quickAmountStr}
          </div>
        </div>

        <Keypad onDigit={actions.quickPress} onBackspace={actions.quickBack} />

        <button
          onClick={actions.saveQuick}
          style={{
            width: '100%', padding: 15, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)', border: 'none',
            borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'",
            boxShadow: '0 10px 24px -6px rgba(142,123,255,.6)',
          }}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
