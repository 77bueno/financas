import { useFinance } from '../state/store';
import { CAT_EMOJIS } from '../state/constants';
import { AmountField } from './AmountField';

const segBtnStyle: React.CSSProperties = {
  flex: 1, border: 'none', padding: 9, borderRadius: 10, fontSize: 13, fontWeight: 600,
  cursor: 'pointer', fontFamily: "'Inter'",
};

export function AddTransactionSheet() {
  const { state, actions, derived } = useFinance();
  if (!state.addOpen) return null;

  const editing = state.addEditId !== null;

  const seg = {
    despesa: { bg: state.addType === 'despesa' ? '#10B981' : 'transparent', color: state.addType === 'despesa' ? '#fff' : '#9AA3AF' },
    receita: { bg: state.addType === 'receita' ? '#34D399' : 'transparent', color: state.addType === 'receita' ? '#052E1B' : '#9AA3AF' },
    transferencia: { bg: state.addType === 'transferencia' ? '#FBBF24' : 'transparent', color: state.addType === 'transferencia' ? '#451A03' : '#9AA3AF' },
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
          position: 'absolute', left: 0, right: 0, bottom: 0, background: '#14171C',
          borderRadius: '28px 28px 0 0', borderTop: '1px solid rgba(255,255,255,.1)',
          padding: '12px 22px calc(30px + env(safe-area-inset-bottom))', animation: 'sheetUp .28s cubic-bezier(.22,1,.36,1) both',
          maxHeight: '88%', overflowY: 'auto',
        }}
      >
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,.2)', borderRadius: 99, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <strong style={{ fontSize: 17, color: '#fff', fontWeight: 600 }}>{editing ? 'Editar transação' : 'Nova transação'}</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            {editing && (
              <button
                onClick={() => actions.deleteTxn(state.addEditId!)}
                style={{ background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.3)', color: '#F87171', height: 30, padding: '0 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
              >
                Excluir
              </button>
            )}
            <button
              onClick={actions.closeAdd}
              style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#C3C9D2', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,.05)', borderRadius: 14, padding: 4, gap: 4, marginBottom: 16 }}>
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
              flex: 1, minWidth: 0, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 14, padding: '13px 15px', color: '#fff', fontFamily: "'Inter'", fontSize: 14,
              outline: 'none',
            }}
          />
          <input
            type="date"
            value={state.addDate}
            onChange={e => actions.setAddDate(e.target.value)}
            style={{
              flexShrink: 0, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 14, padding: '13px 12px', color: '#C3C9D2', fontFamily: "'Inter'", fontSize: 13,
              outline: 'none', colorScheme: 'dark',
            }}
          />
        </div>

        <AmountField label="Valor" valueStr={derived.amountStr} color={derived.amountColor} onDigits={actions.setCents} />

        {state.accounts.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em', display: 'block', marginBottom: 8 }}>
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
                      border: `1px solid ${sel ? '#10B981' : 'rgba(255,255,255,.08)'}`,
                      background: sel ? 'rgba(16,185,129,.22)' : 'rgba(255,255,255,.04)',
                      color: sel ? '#fff' : '#C3C9D2',
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
                <span style={{ fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em', display: 'block', margin: '10px 0 8px' }}>ENTRA NA CONTA</span>
                <div className="fin-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                  {state.accounts.filter(a => a.id !== state.addAccountId).map(a => {
                    const sel = state.addToAccountId === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => actions.setAddToAccountId(sel ? null : a.id)}
                        style={{
                          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                          border: `1px solid ${sel ? '#34D399' : 'rgba(255,255,255,.08)'}`,
                          background: sel ? 'rgba(52,211,153,.18)' : 'rgba(255,255,255,.04)',
                          color: sel ? '#fff' : '#C3C9D2',
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
            <span style={{ fontSize: 11, color: '#6B7280', display: 'block', marginTop: 6 }}>
              {state.addAccountId ? 'O saldo da conta atualiza automaticamente.' : 'Sem conta selecionada — os saldos não mudam.'}
            </span>
          </div>
        )}

        {state.addType === 'despesa' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em' }}>CATEGORIA</span>
              <button
                onClick={actions.toggleNewCat}
                style={{ background: 'none', border: 'none', color: '#34D399', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
              >
                {state.newCatOpen ? 'cancelar' : '+ nova categoria'}
              </button>
            </div>

            {state.newCatOpen ? (
              <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  value={state.newCatName}
                  onChange={e => actions.setNewCatName(e.target.value)}
                  placeholder="Nome da categoria — ex.: Educação"
                  autoFocus
                  style={{
                    width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
                    borderRadius: 12, padding: '11px 13px', color: '#fff', fontFamily: "'Inter'", fontSize: 13.5, outline: 'none',
                  }}
                />
                <div className="fin-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                  {CAT_EMOJIS.map(e => (
                    <button
                      key={e}
                      onClick={() => actions.setNewCatIcon(e)}
                      style={{
                        flexShrink: 0, width: 38, height: 38, borderRadius: 11, fontSize: 18, cursor: 'pointer',
                        background: state.newCatIcon === e ? 'rgba(16,185,129,.3)' : 'rgba(255,255,255,.05)',
                        border: state.newCatIcon === e ? '1px solid #10B981' : '1px solid rgba(255,255,255,.08)',
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <button
                  onClick={actions.saveNewCat}
                  style={{ width: '100%', padding: 11, background: 'linear-gradient(135deg,#10B981,#059669)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
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
                        border: `1px solid ${sel ? c.color : 'rgba(255,255,255,.08)'}`,
                        background: sel ? c.bg : 'rgba(255,255,255,.04)',
                        color: sel ? '#fff' : '#C3C9D2',
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

        <button
          onClick={actions.save}
          style={{
            width: '100%', padding: 15, background: 'linear-gradient(135deg,#10B981,#059669)', border: 'none',
            borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
            boxShadow: '0 10px 24px -6px rgba(16,185,129,.6)',
          }}
        >
          {editing ? 'Salvar alterações' : 'Salvar transação'}
        </button>
      </div>
    </div>
  );
}
