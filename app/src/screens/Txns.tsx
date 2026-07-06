import { useMemo, useState } from 'react';
import { useFinance } from '../state/store';
import { dateLabel } from '../utils/format';
import { Icon } from '../components/Icon';

type TypeFilter = 'todas' | 'despesas' | 'receitas';

const chip = (active: boolean, color = '#10B981'): React.CSSProperties => ({
  flexShrink: 0, padding: '7px 13px', borderRadius: 99, fontSize: 12.5, fontWeight: 500,
  cursor: 'pointer', fontFamily: "'Inter'",
  background: active ? 'rgba(16,185,129,.22)' : 'rgba(255,255,255,.04)',
  border: `1px solid ${active ? color : 'rgba(255,255,255,.08)'}`,
  color: active ? '#fff' : '#C3C9D2',
});

export function Txns() {
  const { state, actions, derived } = useFinance();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('todas');
  const [catFilter, setCatFilter] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return derived.txnRows.filter(t => {
      if (typeFilter === 'despesas' && !t.isExpense) return false;
      if (typeFilter === 'receitas' && t.isExpense) return false;
      if (catFilter && t.cat !== catFilter) return false;
      if (q && !`${t.desc} ${t.cat}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [derived.txnRows, search, typeFilter, catFilter]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof rows>();
    for (const t of rows) {
      const label = dateLabel(t.date);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(t);
    }
    return [...map.entries()];
  }, [rows]);

  const usedCats = useMemo(() => {
    const s = new Set(derived.txnRows.filter(t => t.isExpense).map(t => t.cat));
    return state.categories.filter(c => s.has(c.name));
  }, [derived.txnRows, state.categories]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={actions.goHome} style={{ background: 'rgba(255,255,255,.06)', border: 'none', width: 34, height: 34, borderRadius: 11, color: '#C3C9D2', fontSize: 16, cursor: 'pointer' }}>‹</button>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em' }}>EXTRATO</span>
          <strong style={{ fontSize: 20, color: '#EDEFF2', fontWeight: 700 }}>Todas as transações</strong>
        </div>
        <button
          onClick={actions.openAdd}
          style={{ background: '#10B981', border: 'none', height: 36, padding: '0 14px', borderRadius: 12, color: '#04120C', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
        >
          + Nova
        </button>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar — ex.: assinatura Claude, faculdade…"
        style={{
          width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
          borderRadius: 14, padding: '12px 15px', color: '#fff', fontFamily: "'Inter'", fontSize: 13.5, outline: 'none',
        }}
      />

      <div className="fin-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        <button style={chip(typeFilter === 'todas')} onClick={() => setTypeFilter('todas')}>Todas</button>
        <button style={chip(typeFilter === 'despesas', '#F87171')} onClick={() => setTypeFilter('despesas')}>Despesas</button>
        <button style={chip(typeFilter === 'receitas', '#34D399')} onClick={() => setTypeFilter('receitas')}>Receitas</button>
        {usedCats.map(c => (
          <button key={c.id} style={chip(catFilter === c.name, c.color)} onClick={() => setCatFilter(catFilter === c.name ? null : c.name)}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {groups.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(16,185,129,.12)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="list" size={28} /></div>
          <span style={{ fontSize: 13.5, color: '#9AA3AF', lineHeight: 1.5 }}>
            {derived.txnRows.length === 0 ? 'Nenhuma transação registrada ainda.' : 'Nada encontrado com esses filtros.'}
          </span>
          {derived.txnRows.length === 0 && (
            <button
              onClick={actions.openAdd}
              style={{ padding: '12px 20px', background: '#10B981', border: 'none', borderRadius: 13, color: '#04120C', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
            >
              + Registrar a primeira
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {groups.map(([label, txs]) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em', padding: '2px 2px 0' }}>{label.toUpperCase()}</span>
            {txs.map(t => (
              <button
                key={t.id}
                onClick={() => actions.openEditTxn(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, cursor: 'pointer', fontFamily: "'Inter'", textAlign: 'left',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{t.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: '#EDEFF2', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</div>
                  <div style={{ fontSize: 11.5, color: '#6B7280' }}>{t.cat}</div>
                </div>
                <span style={{ fontFamily: "'Space Grotesk'", fontSize: 14, fontWeight: 600, color: t.color, flexShrink: 0 }}>{t.amountStr}</span>
                <span style={{ color: '#6B7280', fontSize: 15, flexShrink: 0 }}>›</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
