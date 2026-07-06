import { useFinance } from '../state/store';
import { Icon } from '../components/Icon';

function saudacao(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia,';
  if (h < 18) return 'Boa tarde,';
  return 'Boa noite,';
}

const emptyHint: React.CSSProperties = {
  fontSize: 12.5, color: '#6B7280', textAlign: 'center', padding: '14px 0',
};

export function Home() {
  const { state, actions, derived } = useFinance();
  const name = state.userName.trim();
  const initial = (name[0] || '•').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'fadeIn .3s both' }}>
      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12, color: '#9AA3AF' }}>{saudacao()}</span>
          <strong style={{ fontSize: 15, color: '#EDEFF2', fontWeight: 600 }}>{name || 'bem-vindo(a)'}</strong>
        </div>
        <button
          onClick={actions.goProfile}
          style={{
            width: 42, height: 42, borderRadius: 14, background: '#10B981',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700,
            fontFamily: "'Space Grotesk'", fontSize: 17,
            border: 'none', cursor: 'pointer',
          }}
        >
          {initial}
        </button>
      </div>

      <div className="screen-cols">
      <div className="screen-col">
      {/* patrimonio hero */}
      <div
        style={{
          position: 'relative', background: 'linear-gradient(150deg, rgba(16,185,129,.22), rgba(5,150,105,.10))',
          border: '1px solid rgba(255,255,255,.1)', borderRadius: 26, padding: 22, overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)' }}>Patrimônio total</span>
          <button
            onClick={actions.toggleEye}
            style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#C3C9D2', fontSize: 12, padding: '5px 10px', borderRadius: 99, cursor: 'pointer', fontFamily: "'Inter'" }}
          >
            ocultar
          </button>
        </div>
        <div style={{ fontFamily: "'Space Grotesk'", fontSize: 38, fontWeight: 600, color: '#fff', letterSpacing: '-.02em', marginTop: 6, position: 'relative' }}>
          {derived.balTotal}
        </div>
        <button
          onClick={actions.goYear}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'rgba(52,211,153,.14)',
            padding: '6px 12px', borderRadius: 99, position: 'relative', border: 'none', cursor: 'pointer', fontFamily: "'Inter'",
          }}
        >
          {derived.monthGrowthStr ? (
            <span style={{ color: '#34D399', fontSize: 12.5, fontWeight: 600 }}>{derived.monthGrowthStr}</span>
          ) : (
            <span style={{ color: '#34D399', fontSize: 12.5, fontWeight: 600 }}>histórico</span>
          )}
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>· ver o ano ›</span>
        </button>
      </div>

      {/* planejar cta */}
      <button
        onClick={actions.goPlan}
        style={{
          textAlign: 'left', background: 'linear-gradient(135deg, rgba(52,211,153,.16), rgba(16,185,129,.12))',
          border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: 15, cursor: 'pointer',
          fontFamily: "'Inter'", display: 'flex', alignItems: 'center', gap: 13,
        }}
      >
        <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(52,211,153,.14)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="calc" size={20} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <strong style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600 }}>Planejar meu mês</strong>
          <span style={{ fontSize: 11.5, color: '#9AA3AF' }}>Salário → dívidas → quanto sobra pra investir</span>
        </div>
        <span style={{ fontSize: 18, color: '#34D399' }}>›</span>
      </button>

      {/* onde esta meu dinheiro */}
      <button
        onClick={actions.goWealth}
        style={{
          textAlign: 'left', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 22, padding: 18, cursor: 'pointer', fontFamily: "'Inter'", display: 'flex',
          flexDirection: 'column', gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600 }}>Onde está meu dinheiro</strong>
          <span style={{ fontSize: 13, color: '#34D399' }}>Detalhar ›</span>
        </div>
        {derived.hasMoney ? (
          <>
            <div style={{ display: 'flex', height: 12, borderRadius: 99, overflow: 'hidden', gap: 3 }}>
              <div style={{ width: derived.allocInvestW, background: '#10B981', borderRadius: 99 }} />
              <div style={{ width: derived.allocReservaW, background: '#34D399', borderRadius: 99 }} />
              <div style={{ width: derived.allocDispW, background: '#FBBF24', borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 11, color: '#9AA3AF' }}><span style={{ color: '#10B981' }}>●</span> Investido</span>
                <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{derived.investedTotalStr}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 11, color: '#9AA3AF' }}><span style={{ color: '#34D399' }}>●</span> Reserva</span>
                <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{derived.reservaTotalStr}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 11, color: '#9AA3AF' }}><span style={{ color: '#FBBF24' }}>●</span> Disponível</span>
                <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{derived.dispTotalStr}</span>
              </div>
            </div>
          </>
        ) : (
          <span style={{ fontSize: 12.5, color: '#6B7280' }}>Adicione contas e investimentos pelo <strong style={{ color: '#34D399' }}>+</strong> pra ver a distribuição do seu dinheiro.</span>
        )}
      </button>

      {/* month flow */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: 13 }}>
          <span style={{ fontSize: 11, color: '#9AA3AF' }}>Entrou</span>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 15, color: '#34D399', fontWeight: 600, marginTop: 3 }}>{derived.entrouStr}</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: 13 }}>
          <span style={{ fontSize: 11, color: '#9AA3AF' }}>Saiu</span>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 15, color: '#F87171', fontWeight: 600, marginTop: 3 }}>{derived.saiuStr}</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(16,185,129,.14)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 18, padding: 13 }}>
          <span style={{ fontSize: 11, color: '#C3C9D2' }}>Sobrou</span>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 15, color: '#34D399', fontWeight: 600, marginTop: 3 }}>{derived.sobrouStr}</div>
        </div>
      </div>
      </div>

      <div className="screen-col">
      {/* insight computado */}
      {derived.sobrou > 0 && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(52,211,153,.09)', border: '1px solid rgba(52,211,153,.2)', borderRadius: 18, padding: 15 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(52,211,153,.16)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="spark" size={17} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 13, color: '#ECFDF5', lineHeight: 1.45 }}>
              Este mês sobraram <strong>{derived.sobrouStr}</strong> — que tal investir uma parte?
            </span>
            <button
              onClick={actions.goInvest}
              style={{ alignSelf: 'flex-start', background: '#34D399', color: '#052E1B', border: 'none', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 99, cursor: 'pointer', fontFamily: "'Inter'" }}
            >
              Investir agora
            </button>
          </div>
        </div>
      )}

      {/* onde gastei */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 15, color: '#EDEFF2', fontWeight: 600 }}>Onde gastei</strong>
          <button onClick={actions.goSpend} style={{ background: 'none', border: 'none', fontSize: 12.5, color: '#34D399', cursor: 'pointer', fontFamily: "'Inter'" }}>Ver relatório</button>
        </div>
        {derived.homeTopCats.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {derived.homeTopCats.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{c.icon}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: '#D9DEE5' }}>{c.name}</div></div>
                <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{c.totalStr}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyHint}>Nenhum gasto registrado ainda. Toque no <strong style={{ color: '#34D399' }}>+</strong> pra registrar o primeiro.</div>
        )}
      </div>

      {/* recent */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 15, color: '#EDEFF2', fontWeight: 600 }}>Últimas transações</strong>
          <button onClick={actions.goTxns} style={{ background: 'none', border: 'none', fontSize: 12.5, color: '#34D399', cursor: 'pointer', fontFamily: "'Inter'" }}>Ver todas ›</button>
        </div>
        {derived.txnRows.length > 0 ? (
          derived.txnRows.slice(0, 8).map(t => (
            <button
              key={t.id}
              onClick={() => actions.openEditTxn(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter'", textAlign: 'left', width: '100%' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{t.icon}</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13.5, color: '#EDEFF2', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</span>
                <span style={{ fontSize: 11.5, color: '#6B7280' }}>{t.sub}</span>
              </div>
              <span style={{ fontFamily: "'Space Grotesk'", fontSize: 14, fontWeight: 600, color: t.color }}>{t.amountStr}</span>
            </button>
          ))
        ) : (
          <button
            onClick={actions.openAdd}
            style={{ width: '100%', padding: 14, background: 'rgba(255,255,255,.05)', border: '1px dashed rgba(255,255,255,.2)', borderRadius: 16, color: '#34D399', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
          >
            + Registrar primeira transação
          </button>
        )}
      </div>
      </div>
      </div>
    </div>
  );
}
