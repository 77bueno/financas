import { useFinance } from '../state/store';
import { QUICK_TITLE, QUICK_VAL_LABEL, QUICK_PLACEHOLDER } from '../state/constants';
import { AmountField } from './AmountField';

export function QuickAddSheet() {
  const { state, actions, derived } = useFinance();
  if (!state.quickOpen) return null;

  const kind = state.quickKind ?? '';

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 21 }}>
      <div
        onClick={actions.closeQuick}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(2px)', animation: 'fadeIn .2s both' }}
      />
      <div
        className="sheet"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, background: '#14171C',
          borderRadius: '28px 28px 0 0', borderTop: '1px solid rgba(255,255,255,.1)',
          padding: '12px 22px calc(30px + env(safe-area-inset-bottom))', animation: 'sheetUp .28s cubic-bezier(.22,1,.36,1) both',
        }}
      >
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,.2)', borderRadius: 99, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <strong style={{ fontSize: 17, color: '#fff', fontWeight: 600 }}>{QUICK_TITLE[kind] ?? ''}</strong>
          <button
            onClick={actions.closeQuick}
            style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#C3C9D2', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {state.quickKind === 'conta' && (
          <div style={{ display: 'flex', background: 'rgba(255,255,255,.05)', borderRadius: 14, padding: 4, gap: 4, marginBottom: 14 }}>
            <button
              onClick={() => actions.setQuickGroup('disp')}
              style={{
                flex: 1, border: 'none', padding: 9, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
                background: state.quickGroup === 'disp' ? '#10B981' : 'transparent',
                color: state.quickGroup === 'disp' ? '#fff' : '#9AA3AF',
              }}
            >
              💳 Disponível
            </button>
            <button
              onClick={() => actions.setQuickGroup('reserva')}
              style={{
                flex: 1, border: 'none', padding: 9, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
                background: state.quickGroup === 'reserva' ? '#34D399' : 'transparent',
                color: state.quickGroup === 'reserva' ? '#052E1B' : '#9AA3AF',
              }}
            >
              🐷 Guardado
            </button>
          </div>
        )}

        <input
          value={state.quickName}
          onChange={e => actions.setQuickName(e.target.value)}
          placeholder={QUICK_PLACEHOLDER[kind] ?? 'Nome'}
          autoFocus
          style={{
            width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 14, padding: '13px 15px', color: '#fff', fontFamily: "'Inter'", fontSize: 14,
            outline: 'none', marginBottom: 16,
          }}
        />

        <AmountField label={QUICK_VAL_LABEL[kind] ?? 'Valor'} valueStr={derived.quickAmountStr} onDigits={actions.setQuickCents} />

        <button
          onClick={actions.saveQuick}
          style={{
            width: '100%', padding: 15, background: '#10B981', border: 'none',
            borderRadius: 16, color: '#04120C', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
            boxShadow: '0 10px 24px -6px rgba(16,185,129,.6)',
          }}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
