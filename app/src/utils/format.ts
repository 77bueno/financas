export function fmt(n: number): string {
  return 'R$ ' + Math.abs(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function parseDigits(v: string): number {
  return parseInt(String(v).replace(/\D/g, ''), 10) || 0;
}

let idCounter = 0;
export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return isoDate(d);
}

const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function dateLabel(iso: string): string {
  const today = isoDate(new Date());
  if (iso === today) return 'Hoje';
  if (iso === isoDaysAgo(1)) return 'Ontem';
  const [y, m, d] = iso.split('-').map(Number);
  const suffix = y !== new Date().getFullYear() ? ` ${y}` : '';
  return `${d} ${MONTHS_SHORT[(m || 1) - 1]}${suffix}`;
}
