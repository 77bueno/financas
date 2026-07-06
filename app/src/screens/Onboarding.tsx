import { useFinance } from '../state/store';

const backBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.06)', border: 'none', width: 34, height: 34, borderRadius: 11,
  color: '#C3C9D2', fontSize: 16, cursor: 'pointer',
};

const primaryBtnStyle: React.CSSProperties = {
  width: '100%', padding: 15, background: '#10B981', border: 'none',
  borderRadius: 16, color: '#04120C', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
};

const rowInputStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.04)',
  borderRadius: 14, padding: '8px 12px',
};

function StepTag({ label }: { label: string }) {
  return <span style={{ fontFamily: "'Inter'", fontSize: 11.5, color: '#34D399', fontWeight: 600, letterSpacing: '.08em' }}>{label}</span>;
}

export function Onboarding() {
  const { state, actions } = useFinance();

  return (
    <div className="onboard-wrap" style={{ display: 'flex', flexDirection: 'column', minHeight: 680, animation: 'fadeIn .3s both' }}>
      {state.onbStep === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 22, paddingTop: 30 }}>
          <div
            style={{
              width: 60, height: 60, borderRadius: 20, background: '#10B981',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
              boxShadow: '0 12px 30px -8px rgba(16,185,129,.7)',
            }}
          >
            R$
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h1 style={{ margin: 0, fontFamily: "'Space Grotesk'", fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.15, letterSpacing: '-.02em' }}>
              Todo o seu dinheiro,<br />num lugar só.
            </h1>
            <p style={{ margin: 0, fontSize: 14.5, color: '#9AA3AF', lineHeight: 1.55 }}>
              Contas, investimentos, gastos e metas juntos. Comece do zero com os seus números — leva 1 minuto.
            </p>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={actions.startManual}
              style={{
                width: '100%', padding: 16, background: '#10B981', border: 'none',
                borderRadius: 16, color: '#04120C', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
                boxShadow: '0 12px 26px -8px rgba(16,185,129,.7)',
              }}
            >
              Começar do zero
            </button>
            <button
              onClick={actions.loadDemo}
              style={{
                width: '100%', padding: 16, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)',
                borderRadius: 16, color: '#EDEFF2', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
              }}
            >
              Explorar com dados de exemplo
            </button>
            <button
              onClick={actions.finishOnb}
              style={{ width: '100%', padding: 10, background: 'none', border: 'none', color: '#6B7280', fontSize: 13, cursor: 'pointer', fontFamily: "'Inter'" }}
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
            <StepTag label="SEU NOME" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>Como podemos te chamar?</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: '#9AA3AF' }}>Só pra personalizar o seu painel.</p>
          </div>
          <input
            value={state.userName}
            onChange={e => actions.setUserName(e.target.value)}
            placeholder="Seu nome"
            autoFocus
            style={{
              width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 16, padding: '16px 18px', color: '#fff', fontFamily: "'Inter'", fontSize: 17,
              outline: 'none',
            }}
          />
          <div style={{ flex: 1 }} />
          <button onClick={actions.onbNext} style={primaryBtnStyle}>Continuar</button>
        </div>
      )}

      {state.onbStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18, paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={actions.onbBack} style={backBtnStyle}>‹</button>
            <StepTag label="SUAS CONTAS" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>Onde você guarda dinheiro?</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: '#9AA3AF' }}>Adicione suas contas e o saldo atual de cada uma. Você pode editar tudo depois.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {state.accounts.map(a => (
              <div key={a.id} style={rowInputStyle}>
                <input
                  value={a.name}
                  onChange={e => actions.updateAccount(a.id, 'name', e.target.value)}
                  placeholder="Nome da conta"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#EDEFF2', fontFamily: "'Inter'", fontSize: 13.5, minWidth: 0 }}
                />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>R$</span>
                  <input
                    value={a.value ? String(a.value) : ''}
                    onChange={e => actions.updateAccount(a.id, 'value', e.target.value)}
                    inputMode="numeric"
                    placeholder="0"
                    style={{ width: 72, background: 'transparent', border: 'none', outline: 'none', color: '#34D399', fontFamily: "'Space Grotesk'", fontSize: 15, fontWeight: 600, textAlign: 'right' }}
                  />
                </div>
                <button onClick={() => actions.removeAccount(a.id)} style={{ background: 'rgba(255,255,255,.06)', border: 'none', color: '#6B7280', width: 26, height: 26, borderRadius: 8, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>✕</button>
              </div>
            ))}
            <button
              onClick={actions.addAccount}
              style={{ width: '100%', padding: 12, background: 'rgba(255,255,255,.05)', border: '1px dashed rgba(255,255,255,.2)', borderRadius: 14, color: '#34D399', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
            >
              + Adicionar conta
            </button>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={actions.onbNext} style={primaryBtnStyle}>Continuar</button>
        </div>
      )}

      {state.onbStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18, paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={actions.onbBack} style={backBtnStyle}>‹</button>
            <StepTag label="SUA RENDA" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>Quanto você recebe por mês?</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: '#9AA3AF' }}>Usamos pra planejar quanto sobra pra investir.</p>
          </div>
          <div style={{ background: 'linear-gradient(150deg, rgba(52,211,153,.16), rgba(16,185,129,.08))', border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: '#34D399', fontWeight: 500 }}>R$</span>
              <input
                value={state.salary ? String(state.salary) : ''}
                onChange={e => actions.setSalary(e.target.value)}
                inputMode="numeric"
                placeholder="0"
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

      {state.onbStep === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center', padding: '40px 10px' }}>
          <div
            style={{
              width: 76, height: 76, borderRadius: '50%', background: 'rgba(52,211,153,.16)',
              border: '1px solid rgba(52,211,153,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
            }}
          >
            ✓
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#fff' }}>Tudo pronto{state.userName.trim() ? `, ${state.userName.trim()}` : ''}!</h2>
            <p style={{ margin: 0, fontSize: 14, color: '#9AA3AF', lineHeight: 1.55 }}>
              Seu painel está montado com o que você adicionou. Registre gastos, investimentos e metas pelo botão <strong style={{ color: '#34D399' }}>+</strong>.
            </p>
          </div>
          <button
            onClick={actions.finishOnb}
            style={{
              width: '100%', padding: 16, background: '#10B981', border: 'none',
              borderRadius: 16, color: '#04120C', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
              boxShadow: '0 12px 26px -8px rgba(16,185,129,.7)',
            }}
          >
            Ir para o meu painel
          </button>
        </div>
      )}

      {state.connecting && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(5,7,9,.9)', backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            animation: 'fadeIn .2s both',
          }}
        >
          <div style={{ width: 54, height: 54, borderRadius: '50%', border: '3px solid rgba(16,185,129,.25)', borderTopColor: '#10B981', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14, color: '#C3C9D2' }}>Preparando dados de exemplo…</span>
        </div>
      )}
    </div>
  );
}
