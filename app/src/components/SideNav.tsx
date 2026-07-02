import { useFinance } from '../state/store';

const ACTIVE = '#B9A6FF';
const INACTIVE = '#6B6884';

const itemStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  fontFamily: "'Sora'", width: '100%', padding: '10px 0',
};

export function SideNav() {
  const { state, actions } = useFinance();
  if (state.screen === 'onboard') return null;
  const c = (s: string) => (state.screen === s ? ACTIVE : INACTIVE);

  return (
    <nav className="sidenav">
      <div
        style={{
          width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700,
          fontFamily: "'Space Grotesk'", fontSize: 16, boxShadow: '0 0 20px rgba(142,123,255,.45)', marginBottom: 22,
        }}
      >
        R$
      </div>
      <button onClick={actions.goHome} style={{ ...itemStyle, color: c('home') }}>
        <span style={{ fontSize: 20 }}>◆</span><span style={{ fontSize: 10.5 }}>Início</span>
      </button>
      <button onClick={actions.goSpend} style={{ ...itemStyle, color: c('spend') }}>
        <span style={{ fontSize: 20 }}>◑</span><span style={{ fontSize: 10.5 }}>Gastos</span>
      </button>
      <button
        onClick={actions.openHub}
        style={{
          background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)', border: 'none', cursor: 'pointer',
          width: 52, height: 52, borderRadius: 18, color: '#fff', fontSize: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 24px -4px rgba(142,123,255,.8)', margin: '10px 0',
        }}
      >
        +
      </button>
      <button onClick={actions.goInvest} style={{ ...itemStyle, color: c('invest') }}>
        <span style={{ fontSize: 20 }}>▲</span><span style={{ fontSize: 10.5 }}>Investir</span>
      </button>
      <button onClick={actions.goGoals} style={{ ...itemStyle, color: c('goals') }}>
        <span style={{ fontSize: 20 }}>◎</span><span style={{ fontSize: 10.5 }}>Metas</span>
      </button>
    </nav>
  );
}
