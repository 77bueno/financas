import { useFinance } from '../state/store';

export function Wealth() {
  const { actions, derived } = useFinance();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={actions.goHome} style={{ background: 'rgba(255,255,255,.06)', border: 'none', width: 34, height: 34, borderRadius: 11, color: '#C3C9D2', fontSize: 16, cursor: 'pointer' }}>‹</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em' }}>ONDE GUARDO</span>
          <strong style={{ fontSize: 20, color: '#EDEFF2', fontWeight: 700 }}>Minhas contas</strong>
        </div>
      </div>

      <div className="screen-cols">
      <div className="screen-col">
      <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 22, padding: 20, textAlign: 'center' }}>
        <span style={{ fontSize: 12.5, color: '#9AA3AF' }}>Patrimônio líquido</span>
        <div style={{ fontFamily: "'Space Grotesk'", fontSize: 30, fontWeight: 600, color: '#fff', marginTop: 4 }}>{derived.netWorthStr}</div>
        {derived.cardBill > 0 && <span style={{ fontSize: 11.5, color: '#6B7280' }}>após fatura do cartão</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <span style={{ fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em' }}>DISPONÍVEL</span>
        {derived.accDisp.map(a => (
          <button key={a.id} onClick={() => actions.openEditItem('conta', a.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.04)', border: 'none', borderRadius: 16, padding: 14, cursor: 'pointer', fontFamily: "'Inter'", textAlign: 'left', width: '100%' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#EDEFF2', fontWeight: 500 }}>{a.name}</div>
              <div style={{ fontSize: 11.5, color: '#6B7280' }}>{a.bank}</div>
            </div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 15, color: '#fff', fontWeight: 600 }}>{a.valueStr}</span>
            <span style={{ color: '#6B7280', fontSize: 15 }}>›</span>
          </button>
        ))}
        <button
          onClick={() => actions.openQuick('conta')}
          style={{ width: '100%', padding: 12, background: 'rgba(255,255,255,.05)', border: '1px dashed rgba(255,255,255,.2)', borderRadius: 14, color: '#34D399', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
        >
          + Adicionar conta
        </button>
      </div>
      </div>

      <div className="screen-col">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <span style={{ fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em' }}>GUARDADO</span>
        {derived.accReserva.map(a => (
          <button key={a.id} onClick={() => actions.openEditItem('conta', a.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.04)', border: 'none', borderRadius: 16, padding: 14, cursor: 'pointer', fontFamily: "'Inter'", textAlign: 'left', width: '100%' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(52,211,153,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#EDEFF2', fontWeight: 500 }}>{a.name}</div>
              <div style={{ fontSize: 11.5, color: '#34D399' }}>{a.bank}</div>
            </div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 15, color: '#fff', fontWeight: 600 }}>{a.valueStr}</span>
            <span style={{ color: '#6B7280', fontSize: 15 }}>›</span>
          </button>
        ))}
        <button
          onClick={actions.goInvest}
          style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(251,191,36,.10)', border: '1px solid rgba(251,191,36,.2)', borderRadius: 16, padding: 14, cursor: 'pointer', fontFamily: "'Inter'" }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(251,191,36,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>📈</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: '#EDEFF2', fontWeight: 500 }}>Investimentos</div>
            <div style={{ fontSize: 11.5, color: '#6B7280' }}>ver carteira</div>
          </div>
          <span style={{ fontFamily: "'Space Grotesk'", fontSize: 15, color: '#fff', fontWeight: 600 }}>{derived.investedTotalStr} ›</span>
        </button>
      </div>

      {derived.cardBill > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <span style={{ fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em' }}>A PAGAR</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.18)', borderRadius: 16, padding: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(248,113,113,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>💳</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#EDEFF2', fontWeight: 500 }}>Cartão de crédito</div>
              <div style={{ fontSize: 11.5, color: '#F87171' }}>fatura do mês</div>
            </div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 15, color: '#F87171', fontWeight: 600 }}>- {derived.cardBillStr}</span>
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}
