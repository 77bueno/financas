import { useFinance } from '../state/store';
import { CAT_EMOJIS } from '../state/constants';
import { AmountField } from './AmountField';
import { Icon } from './Icon';

const segBtnStyle: React.CSSProperties = {
  flex: 1, border: 'none', padding: 9, borderRadius: 10, fontSize: 13, fontWeight: 600,
  cursor: 'pointer', fontFamily: "'Inter'",
};

export function AddTransactionSheet() {
  const { state, actions, derived } = useFinance();
  if (!state.addOpen) return null;

  const editing = state.addEditId !== null;

  const seg = {
    despesa: { bg: state.addType === 'despesa' ? '#10B981' : 'transparent', color: state.addType === 'despesa' ? 'var(--t1)' : 'var(--t3)' },
    receita: { bg: state.addType === 'receita' ? 'var(--green)' : 'transparent', color: state.addType === 'receita' ? '#052E1B' : 'var(--t3)' },
    transferencia: { bg: state.addType === 'transferencia' ? 'var(--amber)' : 'transparent', color: state.addType === 'transferencia' ? '#451A03' : 'var(--t3)' },
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
      <div
        onClick={actions.closeAdd}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(2px)', animation: 'fadeIn .2s both' }}
      />
      <div
        className="sheet fin-scroll"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--card)',
          borderRadius: '28px 28px 0 0', borderTop: '1px solid var(--w10)',
          padding: '12px 22px calc(30px + env(safe-area-inset-bottom))', animation: 'sheetUp .28s cubic-bezier(.22,1,.36,1) both',
          maxHeight: '88%', overflowY: 'auto',
        }}
      >
        <div style={{ width: 40, height: 4, background: 'var(--w20)', borderRadius: 99, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <strong style={{ fontSize: 17, color: 'var(--t1)', fontWeight: 600 }}>{editing ? 'Editar transação' : 'Nova transação'}</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            {editing && (
              <button
                onClick={() => actions.deleteTxn(state.addEditId!)}
                style={{ background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.3)', color: 'var(--red)', height: 30, padding: '0 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
              >
                Excluir
              </button>
            )}
            <button
              onClick={actions.closeAdd}
              style={{ background: 'var(--w8)', border: 'none', color: 'var(--t2)', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'var(--w5)', borderRadius: 14, padding: 4, gap: 4, marginBottom: 16 }}>
          <button onClick={() => actions.setAddType('despesa')} style={{ ...segBtnStyle, background: seg.despesa.bg, color: seg.despesa.color }}>Despesa</button>
          <button onClick={() => actions.setAddType('receita')} style={{ ...segBtnStyle, background: seg.receita.bg, color: seg.receita.color }}>Receita</button>
          <button onClick={() => actions.setAddType('transferencia')} style={{ ...segBtnStyle, background: seg.transferencia.bg, color: seg.transferencia.color }}>Transferência</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input
            value={state.addDesc}
            onChange={e => actions.setAddDesc(e.target.value)}
            placeholder={state.addType === 'receita' ? 'Ex.: Salário, freela do mês…' : 'Ex.: Assinatura Claude, faculdade, roupa…'}
            style={{
              flex: 1, minWidth: 0, background: 'var(--w5)', border: '1px solid var(--w10)',
              borderRadius: 14, padding: '13px 15px', color: 'var(--t1)', fontFamily: "'Inter'", fontSize: 14,
              outline: 'none',
            }}
          />
          <input
            type="date"
            value={state.addDate}
            onChange={e => actions.setAddDate(e.target.value)}
            style={{
              flexShrink: 0, background: 'var(--w5)', border: '1px solid var(--w10)',
              borderRadius: 14, padding: '13px 12px', color: 'var(--t2)', fontFamily: "'Inter'", fontSize: 13,
              outline: 'none', colorScheme: 'var(--scheme)' as 'dark',
            }}
          />
        </div>

        <AmountField label="Valor" valueStr={derived.amountStr} color={derived.amountColor} onDigits={actions.setCents} />

        {state.accounts.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: 'var(--t3)', letterSpacing: '.04em', display: 'block', marginBottom: 8 }}>
              {state.addType === 'receita' ? 'ENTRA NA CONTA' : state.addType === 'transferencia' ? 'SAI DA CONTA' : 'SAI DA CONTA'}
            </span>
            <div className="fin-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {state.accounts.map(a => {
                const sel = state.addAccountId === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => actions.setAddAccountId(sel ? null : a.id)}
                    style={{
                      flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                      border: `1px solid ${sel ? '#10B981' : 'var(--w8)'}`,
                      background: sel ? 'rgba(16,185,129,.22)' : 'var(--w4)',
                      color: sel ? 'var(--t1)' : 'var(--t2)',
                      padding: '8px 13px', borderRadius: 99, fontSize: 12.5, cursor: 'pointer',
                      fontFamily: "'Inter'", fontWeight: 500,
                    }}
                  >
                    {a.icon} {a.name}
                  </button>
                );
              })}
            </div>
            {state.addType === 'transferencia' && (
              <>
                <span style={{ fontSize: 12, color: 'var(--t3)', letterSpacing: '.04em', display: 'block', margin: '10px 0 8px' }}>ENTRA NA CONTA</span>
                <div className="fin-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                  {state.accounts.filter(a => a.id !== state.addAccountId).map(a => {
                    const sel = state.addToAccountId === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => actions.setAddToAccountId(sel ? null : a.id)}
                        style={{
                          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                          border: `1px solid ${sel ? 'var(--green)' : 'var(--w8)'}`,
                          background: sel ? 'rgba(52,211,153,.18)' : 'var(--w4)',
                          color: sel ? 'var(--t1)' : 'var(--t2)',
                          padding: '8px 13px', borderRadius: 99, fontSize: 12.5, cursor: 'pointer',
                          fontFamily: "'Inter'", fontWeight: 500,
                        }}
                      >
                        {a.icon} {a.name}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            <span style={{ fontSize: 11, color: 'var(--t4)', display: 'block', marginTop: 6 }}>
              {state.addAccountId ? 'O saldo da conta atualiza automaticamente.' : 'Sem conta selecionada — os saldos não mudam.'}
            </span>
          </div>
        )}

        {state.addType === 'despesa' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--t3)', letterSpacing: '.04em' }}>CATEGORIA</span>
              <button
                onClick={actions.toggleNewCat}
                style={{ background: 'none', border: 'none', color: 'var(--green)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
              >
                {state.newCatOpen ? 'cancelar' : '+ nova categoria'}
              </button>
            </div>

            {state.newCatOpen ? (
              <div style={{ background: 'var(--w4)', border: '1px solid var(--w10)', borderRadius: 16, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  value={state.newCatName}
                  onChange={e => actions.setNewCatName(e.target.value)}
                  placeholder="Nome da categoria — ex.: Educação"
                  autoFocus
                  style={{
                    width: '100%', background: 'var(--w5)', border: '1px solid var(--w10)',
                    borderRadius: 12, padding: '11px 13px', color: 'var(--t1)', fontFamily: "'Inter'", fontSize: 13.5, outline: 'none',
                  }}
                />
                <div className="fin-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                  {CAT_EMOJIS.map(e => (
                    <button
                      key={e}
                      onClick={() => actions.setNewCatIcon(e)}
                      style={{
                        flexShrink: 0, width: 38, height: 38, borderRadius: 11, fontSize: 18, cursor: 'pointer',
                        background: state.newCatIcon === e ? 'rgba(16,185,129,.3)' : 'var(--w5)',
                        border: state.newCatIcon === e ? '1px solid #10B981' : '1px solid var(--w8)',
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <button
                  onClick={actions.saveNewCat}
                  style={{ width: '100%', padding: 11, background: '#10B981', border: 'none', borderRadius: 12, color: '#04120C', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
                >
                  Criar categoria
                </button>
              </div>
            ) : (
              <div className="fin-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                {state.categories.map(c => {
                  const sel = state.addCat === c.name;
                  return (
                    <button
                      key={c.id}
                      onClick={() => actions.setAddCat(c.name)}
                      style={{
                        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                        border: `1px solid ${sel ? c.color : 'var(--w8)'}`,
                        background: sel ? c.bg : 'var(--w4)',
                        color: sel ? 'var(--t1)' : 'var(--t2)',
                        padding: '8px 13px', borderRadius: 99, fontSize: 12.5, cursor: 'pointer',
                        fontFamily: "'Inter'", fontWeight: 500,
                      }}
                    >
                      {c.icon} {c.name}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!editing && state.addType !== 'transferencia' && (
          <button
            onClick={actions.toggleAddRecurring}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', marginBottom: 12,
              background: state.addRecurring ? 'rgba(52,211,153,.1)' : 'var(--w4)',
              border: `1px solid ${state.addRecurring ? 'rgba(52,211,153,.4)' : 'var(--w10)'}`,
              borderRadius: 12, cursor: 'pointer', fontFamily: "'Inter'", textAlign: 'left',
            }}
          >
            <span
              style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                background: state.addRecurring ? '#10B981' : 'transparent',
                border: state.addRecurring ? 'none' : '1.5px solid var(--w30)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04120C',
              }}
            >
              {state.addRecurring && <Icon name="check" size={12} strokeWidth={3} />}
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 13.5, color: 'var(--t1)', fontWeight: 500 }}>Repetir todo mês</span>
              <span style={{ display: 'block', fontSize: 11.5, color: 'var(--t3)' }}>Lança sozinha no dia {Math.min(parseInt(state.addDate.slice(8, 10), 10) || 1, 28)} dos próximos meses</span>
            </span>
          </button>
        )}

        <button
          onClick={actions.save}
          style={{
            width: '100%', padding: 15, background: '#10B981', border: 'none',
            borderRadius: 14, color: '#04120C', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
          }}
        >
          {editing ? 'Salvar alterações' : 'Salvar transação'}
        </button>
      </div>
    </div>
  );
}
