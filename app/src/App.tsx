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
import { SideNav } from './components/SideNav';

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
    <div className="app-layout">
      <SideNav />
      <div className="app-card">
        <div className="fin-scroll app-scroll">
          <div className="content">
            <Screen />
          </div>
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
