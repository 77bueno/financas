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
