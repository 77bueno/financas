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
          position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--card)',
          borderRadius: '28px 28px 0 0', borderTop: '1px solid var(--w10)',
          padding: '12px 22px calc(30px + env(safe-area-inset-bottom))', animation: 'sheetUp .28s cubic-bezier(.22,1,.36,1) both',
        }}
      >
        <div style={{ width: 40, height: 4, background: 'var(--w20)', borderRadius: 99, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <strong style={{ fontSize: 17, color: 'var(--t1)', fontWeight: 600 }}>Editar categoria</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            {!isOutros && (
              <button
                onClick={actions.deleteCat}
                style={{ background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.3)', color: 'var(--red)', height: 30, padding: '0 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
              >
                Excluir
              </button>
            )}
            <button
              onClick={actions.closeCatEdit}
              style={{ background: 'var(--w8)', border: 'none', color: 'var(--t2)', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}
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
            width: '100%', background: 'var(--w5)', border: '1px solid var(--w10)',
            borderRadius: 12, padding: '13px 15px', color: isOutros ? 'var(--t4)' : 'var(--t1)', fontFamily: "'Inter'", fontSize: 14,
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
                background: state.catEditIcon === e ? 'rgba(52,211,153,.25)' : 'var(--w5)',
                border: state.catEditIcon === e ? '1px solid #34D399' : '1px solid var(--w8)',
              }}
            >
              {e}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, background: 'var(--w4)', border: '1px solid var(--w7)', borderRadius: 12, padding: '10px 12px' }}>
          <span style={{ fontSize: 12.5, color: 'var(--t3)' }}>Posição nos chips</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => cat && actions.moveCat(cat.id, -1)}
              title="Mover pra cima"
              style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--w6)', border: '1px solid var(--w10)', color: 'var(--t2)', fontSize: 14, cursor: 'pointer' }}
            >
              ↑
            </button>
            <button
              onClick={() => cat && actions.moveCat(cat.id, 1)}
              title="Mover pra baixo"
              style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--w6)', border: '1px solid var(--w10)', color: 'var(--t2)', fontSize: 14, cursor: 'pointer' }}
            >
              ↓
            </button>
          </div>
        </div>

        {!isOutros && (
          <p style={{ margin: '0 0 14px', fontSize: 11.5, color: 'var(--t4)', lineHeight: 1.5 }}>
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
