export type Screen = 'onboard' | 'home' | 'spend' | 'invest' | 'goals' | 'wealth' | 'plan' | 'year' | 'profile' | 'txns';

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
  /** optional target month, ISO YYYY-MM; enables the "save R$X/month" pace */
  deadline?: string;
}

export interface Debt {
  id: string;
  name: string;
  value: number;
}

export interface YearPoint {
  key: string;
  m: string;
  v: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  /** monthly budget in R$; absent/0 = no budget */
  budget?: number;
}

export interface Recurrence {
  id: string;
  desc: string;
  cat: string;
  icon: string;
  amount: number; // signed like a Txn
  accountId?: string | null;
  day: number; // day of month it posts (1–28)
}

export interface Txn {
  id: string;
  desc: string;
  cat: string;
  icon: string;
  date: string; // ISO YYYY-MM-DD
  amount: number;
  /** account the money left from (despesa/transferência) or entered (receita) */
  accountId?: string | null;
  /** destination account, only for transferências */
  toAccountId?: string | null;
  /** set when this transaction was posted by a recurrence */
  recId?: string | null;
}

export type TxnType = 'despesa' | 'receita' | 'transferencia';
export type QuickKind = 'conta' | 'cofrinho' | 'investimento' | null;
export type EditKind = 'conta' | 'cofrinho' | 'investimento' | null;

export interface AppState {
  screen: Screen;
  onbStep: number;
  connecting: boolean;
  hubOpen: boolean;
  quickOpen: boolean;
  quickKind: QuickKind;
  quickName: string;
  quickCents: number;
  quickGroup: AccountGroup;
  /** target month (YYYY-MM) when creating a cofrinho; '' = none */
  quickDeadline: string;
  hidden: boolean;
  addOpen: boolean;
  addType: TxnType;
  addCat: string;
  addDesc: string;
  addDate: string;
  addAccountId: string | null;
  addToAccountId: string | null;
  addRecurring: boolean;
  addEditId: string | null;
  /** month shown in the spending report; null = current */
  spendMonth: string | null;
  /** category whose budget is being edited (sheet open) */
  budgetCat: string | null;
  budgetCents: number;
  /** category being renamed/edited in the profile (sheet open) */
  catEditId: string | null;
  catEditName: string;
  catEditIcon: string;
  /** last deleted transaction, restorable from the toast */
  undoTxn: Txn | null;
  /** last deleted conta/investimento/cofrinho, restorable from the toast */
  undoItem: { kind: 'conta'; index: number; item: Account }
    | { kind: 'investimento'; index: number; item: Investment }
    | { kind: 'cofrinho'; index: number; item: Goal }
    | null;
  newCatOpen: boolean;
  newCatName: string;
  newCatIcon: string;
  editKind: EditKind;
  editId: string | null;
  editName: string;
  editCents: number;
  editCents2: number;
  editGroup: AccountGroup;
  /** target month (YYYY-MM) when editing a cofrinho; '' = none */
  editDeadline: string;
  cents: number;
  toast: boolean;
  toastMsg: string;
  userName: string;
  salary: number;
  cardBill: number;
  debts: Debt[];
  investPct: number;
  categories: Category[];
  recurrences: Recurrence[];
  accounts: Account[];
  investments: Investment[];
  goals: Goal[];
  yearData: YearPoint[];
  txns: Txn[];
}
