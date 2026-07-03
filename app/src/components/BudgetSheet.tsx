import { useFinance } from '../state/store';
import { AmountField } from './AmountField';

/** Bottom sheet to set/clear a category's monthly budget. */
export function BudgetSheet() {
  const { state, actions, derived } = useFinance();
  if (!state.budgetCat) return null;
  const cat = state.categories.find(c => c.name === state.budgetCat);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 22 }}>
      <div
        onClick={actions.closeBudget}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(2px)', animation: 'fadeIn .2s both' }}
      />
      <div
        className="sheet"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, background: '#14171C',
          borderRadius: '28px 28px 0 0', borderTop: '1px solid rgba(255,255,255,.1)',
          padding: '12px 22px calc(30px + env(safe-area-inset-bottom))', animation: 'sheetUp .28s cubic-bezier(.22,1,.36,1) both',
        }}
      >
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,.2)', borderRadius: 99, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <strong style={{ fontSize: 17, color: '#fff', fontWeight: 600 }}>
            {cat?.icon} Orçamento — {state.budgetCat}
          </strong>
          <button
            onClick={actions.closeBudget}
            style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#C3C9D2', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#9AA3AF', lineHeight: 1.5 }}>
          Limite mensal pra essa categoria. O relatório mostra o progresso e avisa quando estourar. Deixe em R$ 0,00 pra remover.
        </p>

        <AmountField label="Limite por mês" valueStr={derived.budgetAmountStr} onDigits={actions.setBudgetCents} />

        <button
          onClick={actions.saveBudget}
          style={{
            width: '100%', padding: 15, background: '#10B981', border: 'none',
            borderRadius: 14, color: '#04120C', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
          }}
        >
          Salvar orçamento
        </button>
      </div>
    </div>
  );
}
