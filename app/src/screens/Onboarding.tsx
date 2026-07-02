import { useFinance } from '../state/store';

const backBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.06)', border: 'none', width: 34, height: 34, borderRadius: 11,
  color: '#C9C5DE', fontSize: 16, cursor: 'pointer',
};

const primaryBtnStyle: React.CSSProperties = {
  width: '100%', padding: 15, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)', border: 'none',
  borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'",
};

const rowInputStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.04)',
  borderRadius: 14, padding: '8px 12px',
};

export function Onboarding() {
  const { state, actions } = useFinance();

  return (
    <div className="onboard-wrap" style={{ display: 'flex', flexDirection: 'column', minHeight: 680, animation: 'fadeIn .3s both' }}>
      {state.onbStep === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 22, paddingTop: 30 }}>
          <div
            style={{
              width: 60, height: 60, borderRadius: 20, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
              boxShadow: '0 12px 30px -8px rgba(142,123,255,.7)',
            }}
          >
            🪙
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h1 style={{ margin: 0, fontFamily: "'Space Grotesk'", fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.15, letterSpacing: '-.02em' }}>
              Todo o seu dinheiro,<br />num lugar só.
            </h1>
            <p style={{ margin: 0, fontSize: 14.5, color: '#9C97B8', lineHeight: 1.55 }}>
              Contas, investimentos, gastos e metas juntos. Vamos começar preenchendo o básico — leva 1 minuto.
            </p>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={actions.connectBank}
              style={{
                width: '100%', padding: 16, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)', border: 'none',
                borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'",
                boxShadow: '0 12px 26px -8px rgba(142,123,255,.7)',
              }}
            >
              🔗 Conectar meu banco
            </button>
            <button
              onClick={actions.startManual}
              style={{
                width: '100%', padding: 16, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)',
                borderRadius: 16, color: '#F3F1FF', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'",
              }}
            >
              ✍️ Adicionar manualmente
            </button>
            <button
              onClick={actions.finishOnb}
              style={{ width: '100%', padding: 10, background: 'none', border: 'none', color: '#7C7896', fontSize: 13, cursor: 'pointer', fontFamily: "'Sora'" }}
            >
              Pular por agora
            </button>
          </div>
        </div>
      )}

      {state.onbStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18, paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={actions.onbBack} style={backBtnStyle}>‹</button>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 12, color: '#8E7BFF', fontWeight: 600 }}>PASSO 1 DE 2</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>Onde você guarda dinheiro?</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: '#9C97B8' }}>Adicione suas contas e o saldo atual de cada uma.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {state.accounts.map(a => (
              <div key={a.id} style={rowInputStyle}>
                <input
                  value={a.name}
                  onChange={e => actions.updateAccount(a.id, 'name', e.target.value)}
                  placeholder="Nome da conta"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F3F1FF', fontFamily: "'Sora'", fontSize: 13.5, minWidth: 0 }}
                />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontSize: 12, color: '#7C7896' }}>R$</span>
                  <input
                    value={a.value ? String(a.value) : ''}
                    onChange={e => actions.updateAccount(a.id, 'value', e.target.value)}
                    inputMode="numeric"
                    placeholder="0"
                    style={{ width: 72, background: 'transparent', border: 'none', outline: 'none', color: '#6EE7B0', fontFamily: "'Space Grotesk'", fontSize: 15, fontWeight: 600, textAlign: 'right' }}
                  />
                </div>
                <button onClick={() => actions.removeAccount(a.id)} style={{ background: 'rgba(255,255,255,.06)', border: 'none', color: '#7C7896', width: 26, height: 26, borderRadius: 8, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>✕</button>
              </div>
            ))}
            <button
              onClick={actions.addAccount}
              style={{ width: '100%', padding: 12, background: 'rgba(255,255,255,.05)', border: '1px dashed rgba(255,255,255,.2)', borderRadius: 14, color: '#B9A6FF', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'" }}
            >
              + Adicionar conta
            </button>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={actions.onbNext} style={primaryBtnStyle}>Continuar</button>
        </div>
      )}

      {state.onbStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18, paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={actions.onbBack} style={backBtnStyle}>‹</button>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 12, color: '#8E7BFF', fontWeight: 600 }}>PASSO 2 DE 2</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>Quanto você recebe por mês?</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: '#9C97B8' }}>Usamos pra planejar quanto sobra pra investir.</p>
          </div>
          <div style={{ background: 'linear-gradient(150deg, rgba(110,231,176,.16), rgba(142,123,255,.08))', border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: '#6EE7B0', fontWeight: 500 }}>R$</span>
              <input
                value={String(state.salary)}
                onChange={e => actions.setSalary(e.target.value)}
                inputMode="numeric"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff',
                  fontFamily: "'Space Grotesk'", fontSize: 38, fontWeight: 600, width: '100%', letterSpacing: '-.02em',
                  borderBottom: '1px solid rgba(255,255,255,.15)', paddingBottom: 4,
                }}
              />
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={actions.onbNext} style={primaryBtnStyle}>Continuar</button>
        </div>
      )}

      {state.onbStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center', padding: '40px 10px' }}>
          <div
            style={{
              width: 76, height: 76, borderRadius: '50%', background: 'rgba(110,231,176,.16)',
              border: '1px solid rgba(110,231,176,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
            }}
          >
            ✓
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#fff' }}>Tudo pronto!</h2>
            <p style={{ margin: 0, fontSize: 14, color: '#9C97B8', lineHeight: 1.55 }}>
              Seu painel já está montado com o que você adicionou. Você pode editar tudo depois pelo botão <strong style={{ color: '#B9A6FF' }}>+</strong>.
            </p>
          </div>
          <button
            onClick={actions.finishOnb}
            style={{
              width: '100%', padding: 16, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)', border: 'none',
              borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'",
              boxShadow: '0 12px 26px -8px rgba(142,123,255,.7)',
            }}
          >
            Ir para o meu painel
          </button>
        </div>
      )}

      {state.connecting && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(8,6,18,.9)', backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            animation: 'fadeIn .2s both',
          }}
        >
          <div style={{ width: 54, height: 54, borderRadius: '50%', border: '3px solid rgba(142,123,255,.25)', borderTopColor: '#8E7BFF', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14, color: '#C9C5DE' }}>Conectando com seu banco…</span>
        </div>
      )}
    </div>
  );
}
