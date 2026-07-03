import { useFinance } from '../state/store';
import { AmountField } from './AmountField';

const TITLES: Record<string, string> = {
  conta: 'Editar conta',
  investimento: 'Editar investimento',
  cofrinho: 'Editar cofrinho',
};

const VAL_LABELS: Record<string, string> = {
  conta: 'Saldo atual',
  investimento: 'Valor aplicado',
  cofrinho: 'Guardado até agora',
};

/** Bottom sheet to edit or delete an existing conta / investimento / cofrinho. */
export function EditSheet() {
  const { state, actions, derived } = useFinance();
  if (!state.editKind) return null;
  const kind = state.editKind;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 22 }}>
      <div
        onClick={actions.closeEdit}
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
          <strong style={{ fontSize: 17, color: '#fff', fontWeight: 600 }}>{TITLES[kind]}</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={actions.deleteEdit}
              style={{ background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.3)', color: '#F87171', height: 30, padding: '0 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
            >
              Excluir
            </button>
            <button
              onClick={actions.closeEdit}
              style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#C3C9D2', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        {kind === 'conta' && (
          <div style={{ display: 'flex', background: 'rgba(255,255,255,.05)', borderRadius: 14, padding: 4, gap: 4, marginBottom: 14 }}>
            <button
              onClick={() => actions.setEditGroup('disp')}
              style={{
                flex: 1, border: 'none', padding: 9, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
                background: state.editGroup === 'disp' ? '#10B981' : 'transparent',
                color: state.editGroup === 'disp' ? '#fff' : '#9AA3AF',
              }}
            >
              💳 Disponível
            </button>
            <button
              onClick={() => actions.setEditGroup('reserva')}
              style={{
                flex: 1, border: 'none', padding: 9, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
                background: state.editGroup === 'reserva' ? '#34D399' : 'transparent',
                color: state.editGroup === 'reserva' ? '#052E1B' : '#9AA3AF',
              }}
            >
              🐷 Guardado
            </button>
          </div>
        )}

        <input
          value={state.editName}
          onChange={e => actions.setEditName(e.target.value)}
          placeholder="Nome"
          style={{
            width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 14, padding: '13px 15px', color: '#fff', fontFamily: "'Inter'", fontSize: 14,
            outline: 'none', marginBottom: 16,
          }}
        />

        <AmountField label={VAL_LABELS[kind]} valueStr={derived.editAmountStr} onDigits={actions.setEditCents} />

        {kind === 'cofrinho' && (
          <AmountField label="Meta a atingir" valueStr={derived.editAmount2Str} onDigits={actions.setEditCents2} />
        )}

        <button
          onClick={actions.saveEdit}
          style={{
            width: '100%', padding: 15, background: 'linear-gradient(135deg,#10B981,#059669)', border: 'none',
            borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
            boxShadow: '0 10px 24px -6px rgba(16,185,129,.6)',
          }}
        >
          Salvar alterações
        </button>
      </div>
    </div>
  );
}
