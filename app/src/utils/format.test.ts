import { describe, it, expect } from 'vitest';
import { fmt, parseDigits, isoDate, dateLabel } from './format';

describe('fmt', () => {
  it('formata em reais com vírgula decimal', () => {
    expect(fmt(1234.5)).toMatch(/^R\$ 1\.234,50$/);
  });
  it('valores negativos aparecem em módulo (o sinal é do contexto)', () => {
    expect(fmt(-99.9)).toBe(fmt(99.9));
  });
});

describe('parseDigits', () => {
  it('extrai só os dígitos (entrada em centavos)', () => {
    expect(parseDigits('R$ 1.205,90')).toBe(120590);
    expect(parseDigits('abc')).toBe(0);
    expect(parseDigits('')).toBe(0);
  });
});

describe('dateLabel', () => {
  it('hoje e ontem têm rótulos próprios', () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(dateLabel(isoDate(today))).toBe('Hoje');
    expect(dateLabel(isoDate(yesterday))).toBe('Ontem');
  });
});
