import { useFinance } from '../state/store';

export function Home() {
  const { actions, derived } = useFinance();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'fadeIn .3s both' }}>
      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div
            style={{
              width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700,
              fontFamily: "'Space Grotesk'", fontSize: 17, boxShadow: '0 0 20px rgba(142,123,255,.45)',
            }}
          >
            L
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, color: '#9C97B8' }}>Bom dia,</span>
            <strong style={{ fontSize: 15, color: '#F3F1FF', fontWeight: 600 }}>Larissa</strong>
          </div>
        </div>
        <div
          style={{
            width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,.06)',
            border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', position: 'relative',
          }}
        >
          <span style={{ fontSize: 16 }}>🔔</span>
          <span style={{ position: 'absolute', top: 9, right: 9, width: 8, height: 8, background: '#FF6E9C', borderRadius: '50%', border: '2px solid #150f2c' }} />
        </div>
      </div>

      <div className="screen-cols">
      <div className="screen-col">
      {/* patrimonio hero */}
      <div
        style={{
          position: 'relative', background: 'linear-gradient(150deg, rgba(142,123,255,.22), rgba(94,62,224,.10))',
          border: '1px solid rgba(255,255,255,.1)', borderRadius: 26, padding: 22, overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -50, right: -30, width: 180, height: 180, background: 'radial-gradient(circle,#8E7BFF,transparent 70%)', opacity: 0.45 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)' }}>Patrimônio total</span>
          <button
            onClick={actions.toggleEye}
            style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#C9C5DE', fontSize: 12, padding: '5px 10px', borderRadius: 99, cursor: 'pointer', fontFamily: "'Sora'" }}
          >
            👁 ocultar
          </button>
        </div>
        <div style={{ fontFamily: "'Space Grotesk'", fontSize: 38, fontWeight: 600, color: '#fff', letterSpacing: '-.02em', marginTop: 6, position: 'relative' }}>
          {derived.balTotal}
        </div>
        <button
          onClick={actions.goYear}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'rgba(110,231,176,.14)',
            padding: '6px 12px', borderRadius: 99, position: 'relative', border: 'none', cursor: 'pointer', fontFamily: "'Sora'",
          }}
        >
          <span style={{ color: '#6EE7B0', fontSize: 12.5, fontWeight: 600 }}>↑ +3,2% este mês</span>
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>· ver o ano ›</span>
        </button>
      </div>

      {/* planejar cta */}
      <button
        onClick={actions.goPlan}
        style={{
          textAlign: 'left', background: 'linear-gradient(135deg, rgba(110,231,176,.16), rgba(142,123,255,.12))',
          border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: 15, cursor: 'pointer',
          fontFamily: "'Sora'", display: 'flex', alignItems: 'center', gap: 13,
        }}
      >
        <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(110,231,176,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🧮</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <strong style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>Planejar meu mês</strong>
          <span style={{ fontSize: 11.5, color: '#9C97B8' }}>Salário → dívidas → quanto sobra pra investir</span>
        </div>
        <span style={{ fontSize: 18, color: '#6EE7B0' }}>›</span>
      </button>

      {/* onde esta meu dinheiro */}
      <button
        onClick={actions.goWealth}
        style={{
          textAlign: 'left', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 22, padding: 18, cursor: 'pointer', fontFamily: "'Sora'", display: 'flex',
          flexDirection: 'column', gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>Onde está meu dinheiro</strong>
          <span style={{ fontSize: 13, color: '#B9A6FF' }}>Detalhar ›</span>
        </div>
        <div style={{ display: 'flex', height: 12, borderRadius: 99, overflow: 'hidden', gap: 3 }}>
          <div style={{ width: derived.allocInvestW, background: '#8E7BFF', borderRadius: 99 }} />
          <div style={{ width: derived.allocReservaW, background: '#6EE7B0', borderRadius: 99 }} />
          <div style={{ width: derived.allocDispW, background: '#E8B96A', borderRadius: 99 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, color: '#9C97B8' }}><span style={{ color: '#8E7BFF' }}>●</span> Investido</span>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{derived.investedTotalStr}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, color: '#9C97B8' }}><span style={{ color: '#6EE7B0' }}>●</span> Reserva</span>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{derived.reservaTotalStr}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, color: '#9C97B8' }}><span style={{ color: '#E8B96A' }}>●</span> Disponível</span>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{derived.dispTotalStr}</span>
          </div>
        </div>
      </button>

      {/* month flow */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: 13 }}>
          <span style={{ fontSize: 11, color: '#9C97B8' }}>Entrou</span>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 15, color: '#6EE7B0', fontWeight: 600, marginTop: 3 }}>R$ 5.600</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: 13 }}>
          <span style={{ fontSize: 11, color: '#9C97B8' }}>Saiu</span>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 15, color: '#FF8FB3', fontWeight: 600, marginTop: 3 }}>R$ 3.180</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(142,123,255,.14)', border: '1px solid rgba(142,123,255,.25)', borderRadius: 18, padding: 13 }}>
          <span style={{ fontSize: 11, color: '#C9C5DE' }}>Sobrou</span>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 15, color: '#B9A6FF', fontWeight: 600, marginTop: 3 }}>R$ 2.420</div>
        </div>
      </div>

      </div>

      <div className="screen-col">
      {/* insight */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(110,231,176,.09)', border: '1px solid rgba(110,231,176,.2)', borderRadius: 18, padding: 15 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(110,231,176,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>💡</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={{ fontSize: 13, color: '#E9FBF3', lineHeight: 1.45 }}>
            Você gastou <strong>12% menos</strong> que em maio. Sobraram <strong>R$ 1.240</strong> livres — que tal investir?
          </span>
          <button
            onClick={actions.goInvest}
            style={{ alignSelf: 'flex-start', background: '#6EE7B0', color: '#08321f', border: 'none', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 99, cursor: 'pointer', fontFamily: "'Sora'" }}
          >
            Investir agora
          </button>
        </div>
      </div>

      {/* onde gastei mini */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 15, color: '#F3F1FF', fontWeight: 600 }}>Onde gastei</strong>
          <button onClick={actions.goSpend} style={{ background: 'none', border: 'none', fontSize: 12.5, color: '#B9A6FF', cursor: 'pointer', fontFamily: "'Sora'" }}>Ver relatório</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,143,179,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🏠</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: '#E7E4F4' }}>Moradia</div></div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#fff', fontWeight: 600 }}>R$ 1.100</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(232,185,106,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🍽️</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: '#E7E4F4' }}>Alimentação</div></div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#fff', fontWeight: 600 }}>R$ 820</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(142,123,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🚗</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: '#E7E4F4' }}>Transporte</div></div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, color: '#fff', fontWeight: 600 }}>R$ 310</span>
          </div>
        </div>
      </div>

      {/* recent */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <strong style={{ fontSize: 15, color: '#F3F1FF', fontWeight: 600 }}>Últimas transações</strong>
        {derived.txnRows.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{t.icon}</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 13.5, color: '#F3F1FF', fontWeight: 500 }}>{t.name}</span>
              <span style={{ fontSize: 11.5, color: '#7C7896' }}>{t.sub}</span>
            </div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 14, fontWeight: 600, color: t.color }}>{t.amountStr}</span>
          </div>
        ))}
      </div>
      </div>
      </div>
    </div>
  );
}
