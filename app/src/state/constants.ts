import type { Category } from './types';

/** palette pairs assigned to user-created categories, in rotation */
export const CAT_PALETTE: Array<{ color: string; bg: string }> = [
  { color: '#E8B96A', bg: 'rgba(232,185,106,.16)' },
  { color: '#8E7BFF', bg: 'rgba(142,123,255,.16)' },
  { color: '#FF8FB3', bg: 'rgba(255,143,179,.16)' },
  { color: '#6EE7B0', bg: 'rgba(110,231,176,.16)' },
  { color: '#B9A6FF', bg: 'rgba(185,166,255,.16)' },
  { color: '#FF6E9C', bg: 'rgba(255,110,156,.16)' },
  { color: '#5E4BA0', bg: 'rgba(94,75,160,.16)' },
];

export const CAT_EMOJIS = ['🎓', '📱', '👕', '🎮', '✈️', '🏋️', '🐶', '🎁', '☕', '💼', '🧾', '💊', '🍽️', '🚗', '🏠', '🎬', '📺', '💸'];

export function defaultCategories(): Category[] {
  return [
    { id: 'cat-alimentacao', name: 'Alimentação', icon: '🍽️', color: '#E8B96A', bg: 'rgba(232,185,106,.16)' },
    { id: 'cat-transporte', name: 'Transporte', icon: '🚗', color: '#8E7BFF', bg: 'rgba(142,123,255,.16)' },
    { id: 'cat-moradia', name: 'Moradia', icon: '🏠', color: '#FF8FB3', bg: 'rgba(255,143,179,.16)' },
    { id: 'cat-lazer', name: 'Lazer', icon: '🎬', color: '#B9A6FF', bg: 'rgba(185,166,255,.16)' },
    { id: 'cat-saude', name: 'Saúde', icon: '💊', color: '#6EE7B0', bg: 'rgba(110,231,176,.16)' },
    { id: 'cat-assinaturas', name: 'Assinaturas', icon: '📺', color: '#FF6E9C', bg: 'rgba(255,110,156,.16)' },
    { id: 'cat-outros', name: 'Outros', icon: '💸', color: '#5E4BA0', bg: 'rgba(94,75,160,.16)' },
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
