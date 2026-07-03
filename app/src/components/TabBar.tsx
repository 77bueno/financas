import { useFinance } from '../state/store';
import { Icon } from './Icon';

const ACTIVE = '#34D399';
const INACTIVE = '#6B7280';

const btnStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  fontFamily: "'Inter'", width: 60,
};

export function TabBar() {
  const { state, actions } = useFinance();
  if (state.screen === 'onboard') return null;
  const c = (s: string) => (state.screen === s ? ACTIVE : INACTIVE);

  const tab = (screen: string, onClick: () => void, icon: string, label: string) => (
    <button key={screen} onClick={onClick} style={{ ...btnStyle, color: c(screen) }}>
      <Icon name={icon} size={21} strokeWidth={state.screen === screen ? 2.2 : 1.8} />
      <span style={{ fontSize: 10, fontWeight: state.screen === screen ? 600 : 500 }}>{label}</span>
    </button>
  );

  return (
    <div
      className="tabbar"
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 'calc(76px + env(safe-area-inset-bottom))', zIndex: 10,
        background: 'rgba(11,13,16,.88)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,.07)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',
        paddingTop: 12, paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tab('home', actions.goHome, 'home', 'Início')}
      {tab('spend', actions.goSpend, 'pie', 'Gastos')}
      <button
        onClick={actions.openHub}
        style={{
          background: '#10B981', border: 'none', cursor: 'pointer',
          width: 50, height: 50, marginTop: -4, borderRadius: 16, color: '#04120C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 20px -6px rgba(16,185,129,.5)',
        }}
      >
        <Icon name="plus" size={24} strokeWidth={2.4} />
      </button>
      {tab('invest', actions.goInvest, 'trend', 'Investir')}
      {tab('goals', actions.goGoals, 'target', 'Metas')}
    </div>
  );
}
