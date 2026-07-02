import { useFinance } from '../state/store';

export function Plan() {
  const { state, actions, derived } = useFinance();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={actions.goHome} style={{ background: 'rgba(255,255,255,.06)', border: 'none', width: 34, height: 34, borderRadius: 11, color: '#C9C5DE', fontSize: 16, cursor: 'pointer' }}>‹</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12, color: '#9C97B8', letterSpacing: '.04em' }}>PLANEJAMENTO</span>
          <strong style={{ fontSize: 20, color: '#F3F1FF', fontWeight: 700 }}>Planejar meu mês</strong>
        </div>
      </div>

      {/* salário input */}
      <div style={{ background: 'linear-gradient(150deg, rgba(110,231,176,.16), rgba(142,123,255,.08))', border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: 20 }}>
        <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.7)' }}>Quanto você recebe por mês?</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
          <span style={{ fontFamily: "'Space Grotesk'", fontSize: 22, color: '#6EE7B0', fontWeight: 500 }}>R$</span>
          <input
            value={String(state.salary)}
            onChange={e => actions.setSalary(e.target.value)}
            inputMode="numeric"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff',
              fontFamily: "'Space Grotesk'", fontSize: 36, fontWeight: 600, width: '100%', letterSpacing: '-.02em',
              borderBottom: '1px solid rgba(255,255,255,.15)', paddingBottom: 4,
            }}
          />
        </div>
        <span style={{ fontSize: 11.5, color: '#7C7896', marginTop: 6, display: 'block' }}>Toque no valor para editar</span>
      </div>

      {/* distribuição bar */}
      <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <strong style={{ fontSize: 14, color: '#F3F1FF', fontWeight: 600 }}>Como seu salário se divide</strong>
        <div style={{ display: 'flex', height: 16, borderRadius: 99, overflow: 'hidden', gap: 3, background: 'rgba(255,255,255,.05)' }}>
          <div style={{ width: derived.barDebtW, background: '#FF8FB3', borderRadius: 99, transition: 'width .3s' }} />
          <div style={{ width: derived.barDailyW, background: '#8E7BFF', borderRadius: 99, transition: 'width .3s' }} />
          <div style={{ width: derived.barInvestW, background: '#6EE7B0', borderRadius: 99, transition: 'width .3s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11.5, color: '#9C97B8' }}><span style={{ color: '#FF8FB3' }}>●</span> Dívidas</span>
          <span style={{ fontSize: 11.5, color: '#9C97B8' }}><span style={{ color: '#8E7BFF' }}>●</span> Dia a dia</span>
          <span style={{ fontSize: 11.5, color: '#9C97B8' }}><span style={{ color: '#6EE7B0' }}>●</span> Investir</span>
        </div>
      </div>

      {/* dívidas / contas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 15, color: '#F3F1FF', fontWeight: 600 }}>Dívidas e contas fixas</strong>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.05)', padding: '4px 10px', borderRadius: 99 }}>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13, fontWeight: 600, color: derived.commitColor }}>{derived.commitPct}</span>
            <span style={{ fontSize: 11, color: '#7C7896' }}>do salário</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: derived.commitColor }}>
          <span>●</span><span>{derived.commitMsg}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {state.debts.map(d => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: '8px 12px' }}>
              <input
                value={d.name}
                onChange={e => actions.updateDebt(d.id, 'name', e.target.value)}
                placeholder="Nome da conta"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F3F1FF', fontFamily: "'Sora'", fontSize: 13.5, minWidth: 0 }}
              />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontSize: 12, color: '#7C7896' }}>R$</span>
                <input
                  value={d.value ? String(d.value) : ''}
                  onChange={e => actions.updateDebt(d.id, 'value', e.target.value)}
                  inputMode="numeric"
                  placeholder="0"
                  style={{ width: 68, background: 'transparent', border: 'none', outline: 'none', color: '#FF8FB3', fontFamily: "'Space Grotesk'", fontSize: 15, fontWeight: 600, textAlign: 'right' }}
                />
              </div>
              <button onClick={() => actions.removeDebt(d.id)} style={{ background: 'rgba(255,255,255,.06)', border: 'none', color: '#7C7896', width: 26, height: 26, borderRadius: 8, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>

        <button
          onClick={actions.addDebt}
          style={{ width: '100%', padding: 12, background: 'rgba(255,255,255,.05)', border: '1px dashed rgba(255,255,255,.2)', borderRadius: 14, color: '#B9A6FF', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'" }}
        >
          + Adicionar conta
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px 0' }}>
          <span style={{ fontSize: 13, color: '#9C97B8' }}>Total em dívidas</span>
          <span style={{ fontFamily: "'Space Grotesk'", fontSize: 16, color: '#FF8FB3', fontWeight: 600 }}>{derived.debtTotalStr}</span>
        </div>
      </div>

      {/* slider investir */}
      <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 14, color: '#F3F1FF', fontWeight: 600 }}>Do que sobra, quanto investir?</strong>
          <span style={{ fontFamily: "'Space Grotesk'", fontSize: 16, color: '#6EE7B0', fontWeight: 600 }}>{state.investPct}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={state.investPct}
          onChange={e => actions.setInvestPct(parseInt(e.target.value, 10))}
          style={{ width: '100%', accentColor: '#6EE7B0', cursor: 'pointer' }}
        />
        <span style={{ fontSize: 11.5, color: '#7C7896' }}>Depois de pagar as dívidas, sobram {derived.availStr} para dividir entre viver e investir.</span>
      </div>

      {/* resultado */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: 'rgba(255,143,179,.10)', border: '1px solid rgba(255,143,179,.2)', borderRadius: 18, padding: 15 }}>
            <span style={{ fontSize: 11.5, color: '#FF8FB3' }}>🧾 Dívidas</span>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 17, color: '#fff', fontWeight: 600, marginTop: 4 }}>{derived.debtTotalStr}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(142,123,255,.10)', border: '1px solid rgba(142,123,255,.2)', borderRadius: 18, padding: 15 }}>
            <span style={{ fontSize: 11.5, color: '#B9A6FF' }}>🛒 Dia a dia</span>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 17, color: '#fff', fontWeight: 600, marginTop: 4 }}>{derived.dailyStr}</div>
          </div>
        </div>
        <div style={{ position: 'relative', background: 'linear-gradient(135deg, rgba(110,231,176,.22), rgba(110,231,176,.08))', border: '1px solid rgba(110,231,176,.35)', borderRadius: 20, padding: 20, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -20, width: 130, height: 130, background: 'radial-gradient(circle,#6EE7B0,transparent 70%)', opacity: 0.3 }} />
          <span style={{ fontSize: 12.5, color: '#A9F0CE', position: 'relative' }}>💸 Sobra pra investir</span>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 32, color: '#fff', fontWeight: 700, marginTop: 4, position: 'relative' }}>{derived.investStr}</div>
          <span style={{ fontSize: 12, color: '#8FDDB6', position: 'relative' }}>por mês · {state.investPct}% do que sobra</span>
        </div>
        <button
          onClick={actions.goInvest}
          style={{ width: '100%', padding: 14, background: '#6EE7B0', border: 'none', borderRadius: 16, color: '#08321f', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'" }}
        >
          Investir esse valor
        </button>
      </div>
    </div>
  );
}
