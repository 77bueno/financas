export type Screen = 'onboard' | 'home' | 'spend' | 'invest' | 'goals' | 'wealth' | 'plan' | 'year';

export type AccountGroup = 'disp' | 'reserva';

export interface Account {
  id: string;
  icon: string;
  name: string;
  bank: string;
  value: number;
  group: AccountGroup;
}

export interface Investment {
  id: string;
  name: string;
  value: number;
  cls: string;
  ret: string;
  good: boolean;
  color: string;
}

export interface Goal {
  id: string;
  icon: string;
  name: string;
  sub: string;
  saved: number;
  target: number;
  color: string;
}

export interface Debt {
  id: string;
  name: string;
  value: number;
}

export interface YearPoint {
  m: string;
  v: number;
}

export interface Txn {
  id: string;
  icon: string;
  name: string;
  sub: string;
  amount: number;
}

export type TxnType = 'despesa' | 'receita' | 'transferencia';
export type QuickKind = 'conta' | 'cofrinho' | 'investimento' | null;

export interface AppState {
  screen: Screen;
  onbStep: number;
  connecting: boolean;
  hubOpen: boolean;
  quickOpen: boolean;
  quickKind: QuickKind;
  quickName: string;
  quickCents: number;
  hidden: boolean;
  addOpen: boolean;
  addType: TxnType;
  addCat: string;
  cents: number;
  toast: boolean;
  salary: number;
  debts: Debt[];
  investPct: number;
  accounts: Account[];
  investments: Investment[];
  goals: Goal[];
  yearData: YearPoint[];
  txns: Txn[];
}
