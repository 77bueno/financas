export function Toast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'absolute', bottom: 'calc(96px + env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%)', zIndex: 30,
        background: '#6EE7B0', color: '#08321f', padding: '10px 18px', borderRadius: 99,
        fontSize: 13, fontWeight: 600, animation: 'floatUp .3s both', boxShadow: '0 10px 24px -8px rgba(0,0,0,.5)',
      }}
    >
      ✓ Transação adicionada
    </div>
  );
}
