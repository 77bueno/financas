const KEY_DEFS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '⌫'];

const keyStyle: React.CSSProperties = {
  padding: 13,
  background: 'rgba(255,255,255,.05)',
  border: 'none',
  borderRadius: 14,
  fontFamily: "'Space Grotesk'",
  fontSize: 20,
  fontWeight: 500,
  color: '#F3F1FF',
  cursor: 'pointer',
};

export function Keypad({ onDigit, onBackspace }: { onDigit: (d: number) => void; onBackspace: () => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
      {KEY_DEFS.map((label, i) => (
        <button
          key={i}
          onClick={() => {
            if (label === '⌫') onBackspace();
            else if (label === ',') { /* no-op, cents-based */ }
            else onDigit(parseInt(label, 10));
          }}
          style={keyStyle}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
