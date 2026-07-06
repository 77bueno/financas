import { useFinance } from '../state/store';
import { CAT_EMOJIS } from '../state/constants';

/** Bottom sheet to rename / re-icon / delete a category. */
export function CatEditSheet() {
  const { state, actions } = useFinance();
  if (!state.catEditId) return null;
  const cat = state.categories.find(c => c.id === state.catEditId);
  const isOutros = cat?.name === 'Outros';

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 22 }}>
      <div
        onClick={actions.closeCatEdit}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <strong style={{ fontSize: 17, color: '#fff', fontWeight: 600 }}>Editar categoria</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            {!isOutros && (
              <button
                onClick={actions.deleteCat}
                style={{ background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.3)', color: '#F87171', height: 30, padding: '0 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
              >
                Excluir
              </button>
            )}
            <button
              onClick={actions.closeCatEdit}
              style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#C3C9D2', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        <input
          value={state.catEditName}
          onChange={e => actions.setCatEditName(e.target.value)}
          placeholder="Nome da categoria"
          disabled={isOutros}
          style={{
            width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 12, padding: '13px 15px', color: isOutros ? '#6B7280' : '#fff', fontFamily: "'Inter'", fontSize: 14,
            outline: 'none', marginBottom: 14,
          }}
        />

        <div className="fin-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
          {CAT_EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => actions.setCatEditIcon(e)}
              style={{
                flexShrink: 0, width: 38, height: 38, borderRadius: 11, fontSize: 18, cursor: 'pointer',
                background: state.catEditIcon === e ? 'rgba(52,211,153,.25)' : 'rgba(255,255,255,.05)',
                border: state.catEditIcon === e ? '1px solid #34D399' : '1px solid rgba(255,255,255,.08)',
              }}
            >
              {e}
            </button>
          ))}
        </div>

        {!isOutros && (
          <p style={{ margin: '0 0 14px', fontSize: 11.5, color: '#6B7280', lineHeight: 1.5 }}>
            Renomear atualiza todos os lançamentos e recorrências. Excluir move tudo pra "Outros".
          </p>
        )}

        <button
          onClick={actions.saveCatEdit}
          style={{
            width: '100%', padding: 15, background: '#10B981', border: 'none',
            borderRadius: 14, color: '#04120C', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
          }}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
