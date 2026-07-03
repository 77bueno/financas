export function Toast({ show, msg }: { show: boolean; msg: string }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'absolute', bottom: 'calc(96px + env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%)', zIndex: 30,
        background: '#34D399', color: '#052E1B', padding: '10px 18px', borderRadius: 99,
        fontSize: 13, fontWeight: 600, animation: 'floatUp .3s both', boxShadow: '0 10px 24px -8px rgba(0,0,0,.5)',
        whiteSpace: 'nowrap',
      }}
    >
      {msg || '✓ Salvo'}
    </div>
  );
}
