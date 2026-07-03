import { useFinance } from '../state/store';
import { Icon } from './Icon';

const ACTIVE = '#EDEFF2';
const INACTIVE = '#8B93A0';

const itemStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 8,
  fontFamily: "'Inter'", fontSize: 13.5, fontWeight: 500,
  padding: '8px 13px', borderRadius: 10,
};

export function TopNav() {
  const { state, actions } = useFinance();
  if (state.screen === 'onboard') return null;
  const active = (s: string) => state.screen === s;
  const initial = (state.userName.trim()[0] || '•').toUpperCase();

  const navBtn = (screen: string, onClick: () => void, icon: string, label: string) => (
    <button
      key={screen}
      onClick={onClick}
      style={{
        ...itemStyle,
        color: active(screen) ? ACTIVE : INACTIVE,
        background: active(screen) ? 'rgba(255,255,255,.06)' : 'none',
      }}
    >
      <Icon name={icon} size={16} strokeWidth={2} style={{ color: active(screen) ? '#34D399' : 'currentColor' }} />
      {label}
    </button>
  );

  return (
    <header className="topnav">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 24 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 10, background: '#10B981',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04120C',
          }}
        >
          <Icon name="wallet" size={19} strokeWidth={2} />
        </div>
        <strong style={{ fontSize: 15.5, color: '#EDEFF2', fontWeight: 700, fontFamily: "'Inter'", letterSpacing: '-.01em' }}>Finanças</strong>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {navBtn('home', actions.goHome, 'home', 'Início')}
        {navBtn('spend', actions.goSpend, 'pie', 'Gastos')}
        {navBtn('txns', actions.goTxns, 'list', 'Extrato')}
        {navBtn('invest', actions.goInvest, 'trend', 'Investir')}
        {navBtn('goals', actions.goGoals, 'target', 'Metas')}
      </nav>

      <button
        onClick={actions.openHub}
        style={{
          marginLeft: 'auto',
          background: '#10B981', border: 'none', cursor: 'pointer',
          height: 38, padding: '0 16px', borderRadius: 10, color: '#04120C', fontSize: 13.5, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'Inter'",
        }}
      >
        <Icon name="plus" size={16} strokeWidth={2.4} />
        Adicionar
      </button>

      <button
        onClick={actions.goProfile}
        title="Meu perfil"
        style={{
          marginLeft: 10,
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(255,255,255,.06)',
          border: state.screen === 'profile' ? '1px solid #34D399' : '1px solid rgba(255,255,255,.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EDEFF2', fontWeight: 600,
          fontFamily: "'Inter'", fontSize: 14, cursor: 'pointer',
        }}
      >
        {initial}
      </button>
    </header>
  );
}
