import { useFinance } from '../state/store';

const ACTIVE = '#B9A6FF';
const INACTIVE = '#6B6884';

const itemStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 8,
  fontFamily: "'Sora'", fontSize: 13.5, fontWeight: 500,
  padding: '9px 14px', borderRadius: 12,
};

export function TopNav() {
  const { state, actions } = useFinance();
  if (state.screen === 'onboard') return null;
  const c = (s: string) => (state.screen === s ? ACTIVE : INACTIVE);
  const initial = (state.userName.trim()[0] || '•').toUpperCase();

  return (
    <header className="topnav">
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginRight: 26 }}>
        <div
          style={{
            width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700,
            fontFamily: "'Space Grotesk'", fontSize: 14, boxShadow: '0 0 18px rgba(142,123,255,.45)',
          }}
        >
          R$
        </div>
        <strong style={{ fontSize: 16, color: '#F3F1FF', fontWeight: 700, fontFamily: "'Space Grotesk'" }}>Finanças</strong>
      </div>

      <button onClick={actions.goHome} style={{ ...itemStyle, color: c('home') }}>
        <span style={{ fontSize: 15 }}>◆</span>Início
      </button>
      <button onClick={actions.goSpend} style={{ ...itemStyle, color: c('spend') }}>
        <span style={{ fontSize: 15 }}>◑</span>Gastos
      </button>
      <button onClick={actions.goInvest} style={{ ...itemStyle, color: c('invest') }}>
        <span style={{ fontSize: 15 }}>▲</span>Investir
      </button>
      <button onClick={actions.goGoals} style={{ ...itemStyle, color: c('goals') }}>
        <span style={{ fontSize: 15 }}>◎</span>Metas
      </button>

      <button
        onClick={actions.openHub}
        style={{
          marginLeft: 'auto',
          background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)', border: 'none', cursor: 'pointer',
          height: 40, padding: '0 18px', borderRadius: 13, color: '#fff', fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'Sora'",
          boxShadow: '0 10px 24px -6px rgba(142,123,255,.7)',
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>Adicionar
      </button>

      <button
        onClick={actions.goProfile}
        title="Meu perfil"
        style={{
          marginLeft: 12,
          width: 40, height: 40, borderRadius: 13, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700,
          fontFamily: "'Space Grotesk'", fontSize: 15, border: state.screen === 'profile' ? '2px solid #B9A6FF' : 'none',
          cursor: 'pointer', boxShadow: '0 0 16px rgba(142,123,255,.4)',
        }}
      >
        {initial}
      </button>
    </header>
  );
}
