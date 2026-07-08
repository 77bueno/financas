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
          position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--card)',
          borderRadius: '28px 28px 0 0', borderTop: '1px solid var(--w10)',
          padding: '12px 22px calc(30px + env(safe-area-inset-bottom))', animation: 'sheetUp .28s cubic-bezier(.22,1,.36,1) both',
        }}
      >
        <div style={{ width: 40, height: 4, background: 'var(--w20)', borderRadius: 99, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <strong style={{ fontSize: 17, color: 'var(--t1)', fontWeight: 600 }}>{TITLES[kind]}</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={actions.deleteEdit}
              style={{ background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.3)', color: 'var(--red)', height: 30, padding: '0 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
            >
              Excluir
            </button>
            <button
              onClick={actions.closeEdit}
              style={{ background: 'var(--w8)', border: 'none', color: 'var(--t2)', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        {kind === 'conta' && (
          <div style={{ display: 'flex', background: 'var(--w5)', borderRadius: 14, padding: 4, gap: 4, marginBottom: 14 }}>
            <button
              onClick={() => actions.setEditGroup('disp')}
              style={{
                flex: 1, border: 'none', padding: 9, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
                background: state.editGroup === 'disp' ? '#10B981' : 'transparent',
                color: state.editGroup === 'disp' ? 'var(--t1)' : 'var(--t3)',
              }}
            >
              💳 Disponível
            </button>
            <button
              onClick={() => actions.setEditGroup('reserva')}
              style={{
                flex: 1, border: 'none', padding: 9, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
                background: state.editGroup === 'reserva' ? 'var(--green)' : 'transparent',
                color: state.editGroup === 'reserva' ? '#052E1B' : 'var(--t3)',
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
            width: '100%', background: 'var(--w5)', border: '1px solid var(--w10)',
            borderRadius: 14, padding: '13px 15px', color: 'var(--t1)', fontFamily: "'Inter'", fontSize: 14,
            outline: 'none', marginBottom: 16,
          }}
        />

        <AmountField label={VAL_LABELS[kind]} valueStr={derived.editAmountStr} onDigits={actions.setEditCents} />

        {kind === 'cofrinho' && (
          <>
            <AmountField label="Meta a atingir" valueStr={derived.editAmount2Str} onDigits={actions.setEditCents2} />
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 11.5, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Prazo pra atingir (opcional)</span>
              <input
                type="month"
                value={state.editDeadline}
                onChange={e => actions.setEditDeadline(e.target.value)}
                style={{
                  width: '100%', background: 'var(--w5)', border: '1px solid var(--w10)',
                  borderRadius: 14, padding: '11px 15px', color: 'var(--t1)', fontFamily: "'Inter'", fontSize: 14,
                  outline: 'none', colorScheme: 'var(--scheme)' as 'dark',
                }}
              />
            </div>
          </>
        )}

        <button
          onClick={actions.saveEdit}
          style={{
            width: '100%', padding: 15, background: '#10B981', border: 'none',
            borderRadius: 16, color: '#04120C', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
            boxShadow: '0 10px 24px -6px rgba(16,185,129,.6)',
          }}
        >
          Salvar alterações
        </button>
      </div>
    </div>
  );
}
