interface SpendRow {
  icon: string;
  iconBg: string;
  name: string;
  pctLabel: string;
  amount: string;
  change?: { text: string; color: string };
}

const ROWS: SpendRow[] = [
  { icon: '🏠', iconBg: 'rgba(255,143,179,.16)', name: 'Moradia', pctLabel: '35% dos gastos', amount: 'R$ 1.100', change: { text: 'igual', color: '#7C7896' } },
  { icon: '🍽️', iconBg: 'rgba(232,185,106,.16)', name: 'Alimentação', pctLabel: '26% dos gastos', amount: 'R$ 820', change: { text: '↓ R$ 90', color: '#6EE7B0' } },
  { icon: '💸', iconBg: 'rgba(255,143,179,.10)', name: 'Outros', pctLabel: '11% dos gastos', amount: 'R$ 400' },
  { icon: '🚗', iconBg: 'rgba(142,123,255,.16)', name: 'Transporte', pctLabel: '10% dos gastos', amount: 'R$ 310', change: { text: '↑ R$ 40', color: '#FF8FB3' } },
  { icon: '💊', iconBg: 'rgba(110,231,176,.16)', name: 'Saúde', pctLabel: '8% dos gastos', amount: 'R$ 240' },
  { icon: '🎬', iconBg: 'rgba(185,166,255,.16)', name: 'Lazer', pctLabel: '6% dos gastos', amount: 'R$ 180' },
  { icon: '📺', iconBg: 'rgba(255,110,156,.16)', name: 'Assinaturas', pctLabel: '4% dos gastos', amount: 'R$ 130' },
];

export function Spend() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, color: '#9C97B8', letterSpacing: '.04em' }}>ONDE GASTEI</span>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 22, color: '#F3F1FF', fontWeight: 700 }}>Junho 2026</strong>
          <span style={{ fontSize: 12.5, color: '#6EE7B0' }}>↓ 12% vs. maio</span>
        </div>
      </div>

      <div className="screen-cols">
      <div className="screen-col">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
        <div
          style={{
            position: 'relative', width: 190, height: 190, borderRadius: '50%',
            background: 'conic-gradient(#FF8FB3 0 35%, #E8B96A 35% 61%, #8E7BFF 61% 71%, #6EE7B0 71% 79%, #B9A6FF 79% 85%, #FF6E9C 85% 89%, #5E4BA0 89% 100%)',
          }}
        >
          <div style={{ position: 'absolute', inset: 26, borderRadius: '50%', background: '#0e0b1c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: '#9C97B8' }}>Total gasto</span>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 24, fontWeight: 600, color: '#fff' }}>R$ 3.180</span>
            <span style={{ fontSize: 11, color: '#7C7896' }}>de R$ 3.600 previsto</span>
          </div>
        </div>
      </div>

      </div>

      <div className="screen-col">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ROWS.map(r => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 11, background: 'rgba(255,255,255,.04)', borderRadius: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: r.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, color: '#F3F1FF', fontWeight: 500 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: '#7C7896' }}>{r.pctLabel}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 14, color: '#fff', fontWeight: 600 }}>{r.amount}</div>
              {r.change && <div style={{ fontSize: 11, color: r.change.color }}>{r.change.text}</div>}
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>
    </div>
  );
}
