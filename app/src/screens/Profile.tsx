import { useState } from 'react';
import { useFinance } from '../state/store';
import { useAuth } from '../auth/authStore';
import { Icon } from '../components/Icon';

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)',
  borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', gap: 12,
};

const labelStyle: React.CSSProperties = { fontSize: 12, color: '#9AA3AF', letterSpacing: '.04em' };

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 14, padding: '13px 15px', color: '#fff', fontFamily: "'Inter'", fontSize: 14, outline: 'none',
};

export function Profile() {
  const { state, actions, derived } = useFinance();
  const auth = useAuth();
  const [confirmReset, setConfirmReset] = useState(false);
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const initial = (state.userName.trim()[0] || '•').toUpperCase();

  const doChangePassword = async () => {
    setPassMsg(null);
    const r = await auth.changePassword(curPass, newPass);
    if (r.ok) {
      setCurPass(''); setNewPass('');
      setPassMsg({ ok: true, text: 'Senha alterada com sucesso.' });
    } else {
      setPassMsg({ ok: false, text: r.error });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn .3s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={actions.goHome} style={{ background: 'rgba(255,255,255,.06)', border: 'none', width: 34, height: 34, borderRadius: 11, color: '#C3C9D2', fontSize: 16, cursor: 'pointer' }}>‹</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={labelStyle}>PERFIL</span>
          <strong style={{ fontSize: 20, color: '#EDEFF2', fontWeight: 700 }}>Minha conta</strong>
        </div>
      </div>

      <div className="screen-cols">
      <div className="screen-col">
      {/* identidade */}
      <div style={{ ...cardStyle, alignItems: 'center', textAlign: 'center', gap: 14 }}>
        <div
          style={{
            width: 72, height: 72, borderRadius: 24, background: 'linear-gradient(135deg,#10B981,#059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700,
            fontFamily: "'Space Grotesk'", fontSize: 30,
          }}
        >
          {initial}
        </div>
        {auth.session && (
          <span style={{ fontSize: 13, color: '#9AA3AF', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="mail" size={14} /> {auth.session.email}
          </span>
        )}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
          <span style={labelStyle}>SEU NOME</span>
          <input
            value={state.userName}
            onChange={e => actions.setUserName(e.target.value)}
            placeholder="Seu nome"
            style={inputStyle}
          />
        </div>
        <button
          onClick={auth.signOut}
          style={{ width: '100%', padding: 12, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, color: '#C3C9D2', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Icon name="logout" size={15} /> Sair da conta
        </button>
      </div>

      {/* segurança */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="lock" size={15} style={{ color: '#9AA3AF' }} /> Trocar senha
        </strong>
        <input
          value={curPass}
          onChange={e => setCurPass(e.target.value)}
          placeholder="Senha atual"
          type="password"
          autoComplete="current-password"
          style={inputStyle}
        />
        <input
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
          placeholder="Nova senha (mín. 6 caracteres)"
          type="password"
          autoComplete="new-password"
          style={inputStyle}
        />
        {passMsg && (
          <span style={{ fontSize: 12.5, color: passMsg.ok ? '#34D399' : '#FCA5A5' }}>{passMsg.text}</span>
        )}
        <button
          onClick={doChangePassword}
          disabled={auth.busy || !curPass || !newPass}
          style={{ width: '100%', padding: 12, background: '#10B981', border: 'none', borderRadius: 12, color: '#04120C', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'", opacity: auth.busy || !curPass || !newPass ? 0.5 : 1 }}
        >
          Alterar senha
        </button>
      </div>

      {/* dados financeiros básicos */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600 }}>Dados do mês</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={labelStyle}>SALÁRIO MENSAL</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '11px 15px' }}>
            <span style={{ fontSize: 13, color: '#34D399', fontFamily: "'Space Grotesk'" }}>R$</span>
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
            <span style={{ fontSize: 13, color: '#F87171', fontFamily: "'Space Grotesk'" }}>R$</span>
            <input
              value={state.cardBill ? String(state.cardBill) : ''}
              onChange={e => actions.setCardBill(e.target.value)}
              inputMode="numeric"
              placeholder="0"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 600 }}
            />
          </div>
          <span style={{ fontSize: 11.5, color: '#6B7280' }}>Aparece como "a pagar" e desconta do patrimônio líquido.</span>
        </div>
      </div>
      </div>

      <div className="screen-col">
      {/* resumo */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600 }}>Resumo</strong>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#9AA3AF' }}>Patrimônio total</span>
          <span style={{ color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{derived.patrimonioStr}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#9AA3AF' }}>Contas cadastradas</span>
          <span style={{ color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.accounts.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#9AA3AF' }}>Investimentos</span>
          <span style={{ color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.investments.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#9AA3AF' }}>Metas / cofrinhos</span>
          <span style={{ color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.goals.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#9AA3AF' }}>Transações registradas</span>
          <span style={{ color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.txns.length}</span>
        </div>
      </div>

      {/* dados */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: '#EDEFF2', fontWeight: 600 }}>Meus dados</strong>
        <span style={{ fontSize: 12.5, color: '#9AA3AF', lineHeight: 1.5 }}>
          Tudo fica salvo somente neste dispositivo (no seu navegador). Nada é enviado pra nenhum servidor.
        </span>
        <button
          onClick={actions.loadDemo}
          style={{ width: '100%', padding: 13, background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 14, color: '#34D399', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
        >
          Carregar dados de exemplo
        </button>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            style={{ width: '100%', padding: 13, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 14, color: '#F87171', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
          >
            Apagar todos os dados
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: '#F87171' }}>Tem certeza? Isso apaga tudo e volta pro início.</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setConfirmReset(false); actions.resetAll(); }}
                style={{ flex: 1, padding: 12, background: '#F87171', border: 'none', borderRadius: 12, color: '#450A0A', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter'" }}
              >
                Sim, apagar tudo
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                style={{ flex: 1, padding: 12, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, color: '#C3C9D2', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
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
