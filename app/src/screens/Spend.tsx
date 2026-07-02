import { useFinance } from '../state/store';
import { MONTHS_PT } from '../state/constants';

export function Spend() {
  const { actions, derived } = useFinance();
  const now = new Date();
  const title = `${MONTHS_PT[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 12, color: '#9C97B8', letterSpacing: '.04em' }}>ONDE GASTEI</span>
          <strong style={{ fontSize: 22, color: '#F3F1FF', fontWeight: 700 }}>{title}</strong>
        </div>
        <button onClick={actions.goTxns} style={{ background: 'none', border: 'none', fontSize: 12.5, color: '#B9A6FF', cursor: 'pointer', fontFamily: "'Sora'" }}>ver extrato ›</button>
      </div>

      {derived.totalSpend > 0 ? (
        <div className="screen-cols">
        <div className="screen-col">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
          <div
            style={{
              position: 'relative', width: 190, height: 190, borderRadius: '50%',
              background: derived.donutBg,
            }}
          >
            <div style={{ position: 'absolute', inset: 26, borderRadius: '50%', background: '#0e0b1c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#9C97B8' }}>Total gasto</span>
              <span style={{ fontFamily: "'Space Grotesk'", fontSize: 24, fontWeight: 600, color: '#fff' }}>{derived.totalSpendStr}</span>
              <span style={{ fontSize: 11, color: '#7C7896' }}>{derived.spendCats.length} categoria{derived.spendCats.length === 1 ? '' : 's'}</span>
            </div>
          </div>
        </div>
        </div>

        <div className="screen-col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {derived.spendCats.map(c => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 11, background: 'rgba(255,255,255,.04)', borderRadius: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: '#F3F1FF', fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#7C7896' }}>{c.pct}% dos gastos</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontSize: 14, color: '#fff', fontWeight: 600 }}>{c.totalStr}</div>
              </div>
            </div>
          ))}
        </div>
        </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ width: 70, height: 70, borderRadius: 22, background: 'rgba(255,143,179,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🧾</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <strong style={{ fontSize: 16, color: '#F3F1FF' }}>Nenhum gasto registrado</strong>
            <span style={{ fontSize: 13, color: '#9C97B8', lineHeight: 1.5 }}>Registre seus gastos e este relatório mostra pra onde seu dinheiro está indo, por categoria.</span>
          </div>
          <button
            onClick={actions.openAdd}
            style={{ padding: '13px 22px', background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)', border: 'none', borderRadius: 14, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'" }}
          >
            + Registrar um gasto
          </button>
        </div>
      )}
    </div>
  );
}
