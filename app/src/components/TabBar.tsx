import { useFinance } from '../state/store';

const ACTIVE = '#B9A6FF';
const INACTIVE = '#6B6884';

const btnStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  fontFamily: "'Sora'",
};

export function TabBar() {
  const { state, actions } = useFinance();
  if (state.screen === 'onboard') return null;
  const c = (s: string) => (state.screen === s ? ACTIVE : INACTIVE);

  return (
    <div
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, zIndex: 10,
        background: 'rgba(12,10,24,.72)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,.07)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 13,
      }}
    >
      <button onClick={actions.goHome} style={{ ...btnStyle, color: c('home') }}>
        <span style={{ fontSize: 19 }}>◆</span><span style={{ fontSize: 10 }}>Início</span>
      </button>
      <button onClick={actions.goSpend} style={{ ...btnStyle, color: c('spend') }}>
        <span style={{ fontSize: 19 }}>◑</span><span style={{ fontSize: 10 }}>Gastos</span>
      </button>
      <button
        onClick={actions.openHub}
        style={{
          background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)', border: 'none', cursor: 'pointer',
          width: 52, height: 52, marginTop: -6, borderRadius: 18, color: '#fff', fontSize: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 24px -4px rgba(142,123,255,.8)',
        }}
      >
        +
      </button>
      <button onClick={actions.goInvest} style={{ ...btnStyle, color: c('invest') }}>
        <span style={{ fontSize: 19 }}>▲</span><span style={{ fontSize: 10 }}>Investir</span>
      </button>
      <button onClick={actions.goGoals} style={{ ...btnStyle, color: c('goals') }}>
        <span style={{ fontSize: 19 }}>◎</span><span style={{ fontSize: 10 }}>Metas</span>
      </button>
    </div>
  );
}
