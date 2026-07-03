interface Props {
  label: string;
  valueStr: string;
  color?: string;
  autoFocus?: boolean;
  onDigits: (raw: string) => void;
}

/**
 * Big centered currency field: user types digits (mobile numeric keyboard or
 * desktop keys) and the value is formatted as centavos-based BRL live.
 */
export function AmountField({ label, valueStr, color = '#fff', autoFocus, onDigits }: Props) {
  return (
    <label style={{ display: 'block', textAlign: 'center', marginBottom: 16, cursor: 'text' }}>
      <span style={{ fontSize: 13, color: '#9AA3AF' }}>{label}</span>
      <input
        value={valueStr}
        onChange={e => onDigits(e.target.value)}
        inputMode="numeric"
        autoFocus={autoFocus}
        style={{
          display: 'block', width: '100%', background: 'transparent', border: 'none', outline: 'none',
          textAlign: 'center', color, fontFamily: "'Space Grotesk'", fontSize: 42, fontWeight: 600,
          letterSpacing: '-.02em', caretColor: '#34D399',
        }}
      />
      <span style={{ fontSize: 11.5, color: '#6B7280' }}>digite o valor em centavos: 1250 → R$ 12,50</span>
    </label>
  );
}
