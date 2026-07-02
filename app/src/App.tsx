import { FinanceProvider, useFinance } from './state/store';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Spend } from './screens/Spend';
import { Invest } from './screens/Invest';
import { Goals } from './screens/Goals';
import { Wealth } from './screens/Wealth';
import { Plan } from './screens/Plan';
import { Year } from './screens/Year';
import { Profile } from './screens/Profile';
import { Txns } from './screens/Txns';
import { EditSheet } from './components/EditSheet';
import { AddTransactionSheet } from './components/AddTransactionSheet';
import { Hub } from './components/Hub';
import { QuickAddSheet } from './components/QuickAddSheet';
import { Toast } from './components/Toast';
import { TabBar } from './components/TabBar';
import { TopNav } from './components/TopNav';

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
    case 'profile': return <Profile />;
    case 'txns': return <Txns />;
    default: return null;
  }
}

function AppShell() {
  return (
    <div className="app-layout">
      <TopNav />
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
        <EditSheet />
        <TabBar />
      </div>
    </div>
  );
}

function ToastGate() {
  const { state } = useFinance();
  return <Toast show={state.toast} msg={state.toastMsg} />;
}

function App() {
  return (
    <FinanceProvider>
      <AppShell />
    </FinanceProvider>
  );
}

export default App;
