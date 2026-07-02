import { FinanceProvider, useFinance } from './state/store';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Spend } from './screens/Spend';
import { Invest } from './screens/Invest';
import { Goals } from './screens/Goals';
import { Wealth } from './screens/Wealth';
import { Plan } from './screens/Plan';
import { Year } from './screens/Year';
import { AddTransactionSheet } from './components/AddTransactionSheet';
import { Hub } from './components/Hub';
import { QuickAddSheet } from './components/QuickAddSheet';
import { Toast } from './components/Toast';
import { TabBar } from './components/TabBar';

function Screen() {
  const { state } = useFinance();
  switch (state.screen) {
    case 'onboard': return <Onboarding />;
    case 'home': return <Home />;
    case 'spend': return <Spend />;
    case 'invest': return <Invest />;
    case 'goals': return <Goals />;
    case 'wealth': return <Wealth />;
    case 'plan': return <Plan />;
    case 'year': return <Year />;
    default: return null;
  }
}

function AppShell() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(130% 80% at 50% -10%, #1b1436 0%, #0a0814 60%)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          minHeight: '100vh',
          background: 'radial-gradient(120% 55% at 82% 0%, #241a4d 0%, #0C0A18 55%)',
          fontFamily: "'Sora', sans-serif",
          overflow: 'hidden',
        }}
      >
        <div
          className="fin-scroll"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            overflowY: 'auto', padding: '24px 20px 96px',
          }}
        >
          <Screen />
        </div>

        <AddTransactionSheet />
        <ToastGate />
        <Hub />
        <QuickAddSheet />
        <TabBar />
      </div>
    </div>
  );
}

function ToastGate() {
  const { state } = useFinance();
  return <Toast show={state.toast} />;
}

function App() {
  return (
    <FinanceProvider>
      <AppShell />
    </FinanceProvider>
  );
}

export default App;
