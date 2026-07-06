interface Props {
  show: boolean;
  msg: string;
  onUndo?: (() => void) | null;
}

export function Toast({ show, msg, onUndo }: Props) {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'absolute', bottom: 'calc(96px + env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%)', zIndex: 30,
        background: '#34D399', color: '#052E1B', padding: '10px 14px 10px 18px', borderRadius: 99,
        fontSize: 13, fontWeight: 600, animation: 'floatUp .3s both', boxShadow: '0 10px 24px -8px rgba(0,0,0,.5)',
        whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10,
      }}
    >
      {msg || '✓ Salvo'}
      {onUndo && (
        <button
          onClick={onUndo}
          style={{
            background: '#052E1B', color: '#34D399', border: 'none', borderRadius: 99,
            padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter'",
          }}
        >
          Desfazer
        </button>
      )}
    </div>
  );
}
