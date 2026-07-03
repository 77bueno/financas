import type { Category } from './types';

/** palette pairs assigned to user-created categories, in rotation */
export const CAT_PALETTE: Array<{ color: string; bg: string }> = [
  { color: '#FBBF24', bg: 'rgba(251,191,36,.14)' },
  { color: '#38BDF8', bg: 'rgba(56,189,248,.14)' },
  { color: '#FB7185', bg: 'rgba(251,113,133,.14)' },
  { color: '#A78BFA', bg: 'rgba(167,139,250,.14)' },
  { color: '#34D399', bg: 'rgba(52,211,153,.14)' },
  { color: '#F472B6', bg: 'rgba(244,114,182,.14)' },
  { color: '#94A3B8', bg: 'rgba(148,163,184,.14)' },
];

export const CAT_EMOJIS = ['🎓', '📱', '👕', '🎮', '✈️', '🏋️', '🐶', '🎁', '☕', '💼', '🧾', '💊', '🍽️', '🚗', '🏠', '🎬', '📺', '💸'];

export function defaultCategories(): Category[] {
  return [
    { id: 'cat-alimentacao', name: 'Alimentação', icon: '🍽️', color: '#FBBF24', bg: 'rgba(251,191,36,.14)' },
    { id: 'cat-transporte', name: 'Transporte', icon: '🚗', color: '#38BDF8', bg: 'rgba(56,189,248,.14)' },
    { id: 'cat-moradia', name: 'Moradia', icon: '🏠', color: '#FB7185', bg: 'rgba(251,113,133,.14)' },
    { id: 'cat-lazer', name: 'Lazer', icon: '🎬', color: '#A78BFA', bg: 'rgba(167,139,250,.14)' },
    { id: 'cat-saude', name: 'Saúde', icon: '💊', color: '#34D399', bg: 'rgba(52,211,153,.14)' },
    { id: 'cat-assinaturas', name: 'Assinaturas', icon: '📺', color: '#F472B6', bg: 'rgba(244,114,182,.14)' },
    { id: 'cat-outros', name: 'Outros', icon: '💸', color: '#94A3B8', bg: 'rgba(148,163,184,.14)' },
  ];
}

export const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const QUICK_TITLE: Record<string, string> = {
  conta: 'Nova conta',
  cofrinho: 'Novo cofrinho',
  investimento: 'Novo investimento',
};

export const QUICK_VAL_LABEL: Record<string, string> = {
  conta: 'Saldo atual',
  cofrinho: 'Meta a atingir',
  investimento: 'Valor aplicado',
};

export const QUICK_PLACEHOLDER: Record<string, string> = {
  conta: 'Ex.: Nubank',
  cofrinho: 'Ex.: Viagem',
  investimento: 'Ex.: CDB',
};
