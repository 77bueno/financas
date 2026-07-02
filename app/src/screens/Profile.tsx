import { useState } from 'react';
import { useFinance } from '../state/store';

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)',
  borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', gap: 12,
};

const labelStyle: React.CSSProperties = { fontSize: 12, color: '#9C97B8', letterSpacing: '.04em' };

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 14, padding: '13px 15px', color: '#fff', fontFamily: "'Sora'", fontSize: 14, outline: 'none',
};

export function Profile() {
  const { state, actions, derived } = useFinance();
  const [confirmReset, setConfirmReset] = useState(false);
  const initial = (state.userName.trim()[0] || '•').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={actions.goHome} style={{ background: 'rgba(255,255,255,.06)', border: 'none', width: 34, height: 34, borderRadius: 11, color: '#C9C5DE', fontSize: 16, cursor: 'pointer' }}>‹</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={labelStyle}>PERFIL</span>
          <strong style={{ fontSize: 20, color: '#F3F1FF', fontWeight: 700 }}>Minha conta</strong>
        </div>
      </div>

      <div className="screen-cols">
      <div className="screen-col">
      {/* identidade */}
      <div style={{ ...cardStyle, alignItems: 'center', textAlign: 'center', gap: 14 }}>
        <div
          style={{
            width: 72, height: 72, borderRadius: 24, background: 'linear-gradient(135deg,#8E7BFF,#5E3EE0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700,
            fontFamily: "'Space Grotesk'", fontSize: 30, boxShadow: '0 0 26px rgba(142,123,255,.5)',
          }}
        >
          {initial}
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
          <span style={labelStyle}>SEU NOME</span>
          <input
            value={state.userName}
            onChange={e => actions.setUserName(e.target.value)}
            placeholder="Seu nome"
            style={inputStyle}
          />
        </div>
      </div>

      {/* dados financeiros básicos */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>Dados do mês</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={labelStyle}>SALÁRIO MENSAL</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '11px 15px' }}>
            <span style={{ fontSize: 13, color: '#6EE7B0', fontFamily: "'Space Grotesk'" }}>R$</span>
            <input
              value={state.salary ? String(state.salary) : ''}
              onChange={e => actions.setSalary(e.target.value)}
              inputMode="numeric"
              placeholder="0"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 600 }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={labelStyle}>FATURA DO CARTÃO (OPCIONAL)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '11px 15px' }}>
            <span style={{ fontSize: 13, color: '#FF8FB3', fontFamily: "'Space Grotesk'" }}>R$</span>
            <input
              value={state.cardBill ? String(state.cardBill) : ''}
              onChange={e => actions.setCardBill(e.target.value)}
              inputMode="numeric"
              placeholder="0"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 600 }}
            />
          </div>
          <span style={{ fontSize: 11.5, color: '#7C7896' }}>Aparece como "a pagar" e desconta do patrimônio líquido.</span>
        </div>
      </div>
      </div>

      <div className="screen-col">
      {/* resumo */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>Resumo</strong>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#9C97B8' }}>Patrimônio total</span>
          <span style={{ color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{derived.patrimonioStr}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#9C97B8' }}>Contas cadastradas</span>
          <span style={{ color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.accounts.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#9C97B8' }}>Investimentos</span>
          <span style={{ color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.investments.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#9C97B8' }}>Metas / cofrinhos</span>
          <span style={{ color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.goals.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#9C97B8' }}>Transações registradas</span>
          <span style={{ color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.txns.length}</span>
        </div>
      </div>

      {/* dados */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: '#F3F1FF', fontWeight: 600 }}>Meus dados</strong>
        <span style={{ fontSize: 12.5, color: '#9C97B8', lineHeight: 1.5 }}>
          Tudo fica salvo somente neste dispositivo (no seu navegador). Nada é enviado pra nenhum servidor.
        </span>
        <button
          onClick={actions.loadDemo}
          style={{ width: '100%', padding: 13, background: 'rgba(142,123,255,.12)', border: '1px solid rgba(142,123,255,.3)', borderRadius: 14, color: '#B9A6FF', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'" }}
        >
          🔎 Carregar dados de exemplo
        </button>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            style={{ width: '100%', padding: 13, background: 'rgba(255,143,179,.08)', border: '1px solid rgba(255,143,179,.25)', borderRadius: 14, color: '#FF8FB3', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'" }}
          >
            🗑 Apagar todos os dados
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: '#FF8FB3' }}>Tem certeza? Isso apaga tudo e volta pro início.</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setConfirmReset(false); actions.resetAll(); }}
                style={{ flex: 1, padding: 12, background: '#FF8FB3', border: 'none', borderRadius: 12, color: '#3d0a1e', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora'" }}
              >
                Sim, apagar tudo
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                style={{ flex: 1, padding: 12, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, color: '#C9C5DE', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora'" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
      </div>
    </div>
  );
}
