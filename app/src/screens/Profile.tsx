import { useRef, useState } from 'react';
import { getTheme, setTheme, type Theme } from '../theme';
import { useFinance } from '../state/store';
import { useAuth } from '../auth/authStore';
import { Icon } from '../components/Icon';

const cardStyle: React.CSSProperties = {
  background: 'var(--w4)', border: '1px solid var(--w7)',
  borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', gap: 12,
};

const labelStyle: React.CSSProperties = { fontSize: 12, color: 'var(--t3)', letterSpacing: '.04em' };

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--w5)', border: '1px solid var(--w10)',
  borderRadius: 14, padding: '13px 15px', color: 'var(--t1)', fontFamily: "'Inter'", fontSize: 14, outline: 'none',
};

export function Profile() {
  const { state, actions, derived } = useFinance();
  const auth = useAuth();
  const [confirmReset, setConfirmReset] = useState(false);
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [importErr, setImportErr] = useState('');
  const [theme, setThemeState] = useState<Theme>(getTheme());
  const fileRef = useRef<HTMLInputElement>(null);

  const switchTheme = (t: Theme) => { setTheme(t); setThemeState(t); };

  const onImportFile = (f: File | undefined) => {
    setImportErr('');
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const r = actions.importData(String(reader.result ?? ''));
      if (!r.ok) setImportErr(r.error ?? 'Arquivo inválido.');
    };
    reader.readAsText(f);
  };
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
        <button onClick={actions.goHome} style={{ background: 'var(--w6)', border: 'none', width: 34, height: 34, borderRadius: 11, color: 'var(--t2)', fontSize: 16, cursor: 'pointer' }}>‹</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={labelStyle}>PERFIL</span>
          <strong style={{ fontSize: 20, color: 'var(--t1)', fontWeight: 700 }}>Minha conta</strong>
        </div>
      </div>

      <div className="screen-cols">
      <div className="screen-col">
      {/* identidade */}
      <div style={{ ...cardStyle, alignItems: 'center', textAlign: 'center', gap: 14 }}>
        <div
          style={{
            width: 72, height: 72, borderRadius: 24, background: '#10B981',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t1)', fontWeight: 700,
            fontFamily: "'Space Grotesk'", fontSize: 30,
          }}
        >
          {initial}
        </div>
        {auth.session && (
          <span style={{ fontSize: 13, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 6 }}>
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
          style={{ width: '100%', padding: 12, background: 'var(--w5)', border: '1px solid var(--w12)', borderRadius: 12, color: 'var(--t2)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Icon name="logout" size={15} /> Sair da conta
        </button>
      </div>

      {/* segurança */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: 'var(--t1)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="lock" size={15} style={{ color: 'var(--t3)' }} /> Trocar senha
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
          <span style={{ fontSize: 12.5, color: passMsg.ok ? 'var(--green)' : 'var(--red2)' }}>{passMsg.text}</span>
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
        <strong style={{ fontSize: 14.5, color: 'var(--t1)', fontWeight: 600 }}>Dados do mês</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={labelStyle}>SALÁRIO MENSAL</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--w5)', border: '1px solid var(--w10)', borderRadius: 14, padding: '11px 15px' }}>
            <span style={{ fontSize: 13, color: 'var(--green)', fontFamily: "'Space Grotesk'" }}>R$</span>
            <input
              value={state.salary ? String(state.salary) : ''}
              onChange={e => actions.setSalary(e.target.value)}
              inputMode="numeric"
              placeholder="0"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--t1)', fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 600 }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={labelStyle}>FATURA DO CARTÃO (OPCIONAL)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--w5)', border: '1px solid var(--w10)', borderRadius: 14, padding: '11px 15px' }}>
            <span style={{ fontSize: 13, color: 'var(--red)', fontFamily: "'Space Grotesk'" }}>R$</span>
            <input
              value={state.cardBill ? String(state.cardBill) : ''}
              onChange={e => actions.setCardBill(e.target.value)}
              inputMode="numeric"
              placeholder="0"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--t1)', fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 600 }}
            />
          </div>
          <span style={{ fontSize: 11.5, color: 'var(--t4)' }}>Aparece como "a pagar" e desconta do patrimônio líquido.</span>
        </div>
      </div>
      </div>

      <div className="screen-col">
      {/* resumo */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: 'var(--t1)', fontWeight: 600 }}>Resumo</strong>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: 'var(--t3)' }}>Patrimônio total</span>
          <span style={{ color: 'var(--t1)', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{derived.patrimonioStr}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: 'var(--t3)' }}>Contas cadastradas</span>
          <span style={{ color: 'var(--t1)', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.accounts.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: 'var(--t3)' }}>Investimentos</span>
          <span style={{ color: 'var(--t1)', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.investments.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: 'var(--t3)' }}>Metas / cofrinhos</span>
          <span style={{ color: 'var(--t1)', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.goals.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: 'var(--t3)' }}>Transações registradas</span>
          <span style={{ color: 'var(--t1)', fontFamily: "'Space Grotesk'", fontWeight: 600 }}>{state.txns.length}</span>
        </div>
      </div>

      {/* dados */}
      {/* aparência */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: 'var(--t1)', fontWeight: 600 }}>Aparência</strong>
        <div style={{ display: 'flex', background: 'var(--w5)', borderRadius: 12, padding: 4, gap: 4 }}>
          <button
            onClick={() => switchTheme('dark')}
            style={{
              flex: 1, border: 'none', padding: 10, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
              background: theme === 'dark' ? '#10B981' : 'transparent',
              color: theme === 'dark' ? '#04120C' : 'var(--t3)',
            }}
          >
            Escuro
          </button>
          <button
            onClick={() => switchTheme('light')}
            style={{
              flex: 1, border: 'none', padding: 10, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'",
              background: theme === 'light' ? '#10B981' : 'transparent',
              color: theme === 'light' ? '#04120C' : 'var(--t3)',
            }}
          >
            Claro
          </button>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--t4)' }}>Vale pra este dispositivo. Sem escolha, seguimos o tema do sistema.</span>
      </div>

      {/* categorias */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: 'var(--t1)', fontWeight: 600 }}>Categorias</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {state.categories.map(c => (
            <button
              key={c.id}
              onClick={() => actions.openCatEdit(c.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 99,
                background: c.bg, border: `1px solid ${c.color}55`, color: 'var(--t1)',
                fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter'",
              }}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--t4)' }}>Toque pra renomear, trocar o ícone ou excluir.</span>
      </div>

      {/* recorrências */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: 'var(--t1)', fontWeight: 600 }}>Recorrências mensais</strong>
        {derived.recRows.length === 0 ? (
          <span style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5 }}>
            Nenhuma ainda. Ao registrar uma transação, marque <strong style={{ color: 'var(--t1)' }}>"Repetir todo mês"</strong> — assinaturas e contas fixas se lançam sozinhas.
          </span>
        ) : (
          derived.recRows.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--w6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--t4)' }}>{r.cat} · todo dia {r.day}</div>
              </div>
              <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13, fontWeight: 600, color: r.color, flexShrink: 0 }}>{r.amountStr}</span>
              <button
                onClick={() => actions.deleteRecurrence(r.id)}
                title="Cancelar recorrência"
                style={{ background: 'var(--w6)', border: 'none', color: 'var(--t4)', width: 26, height: 26, borderRadius: 8, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* backup */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: 'var(--t1)', fontWeight: 600 }}>Backup</strong>
        <span style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5 }}>
          Baixe um arquivo com todos os seus dados — serve de backup e pra migrar de dispositivo.
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={actions.exportData}
            style={{ flex: 1, padding: 12, background: 'rgba(52,211,153,.1)', border: '1px solid rgba(52,211,153,.3)', borderRadius: 12, color: 'var(--green)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
          >
            Exportar dados
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ flex: 1, padding: 12, background: 'var(--w5)', border: '1px solid var(--w12)', borderRadius: 12, color: 'var(--t2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
          >
            Importar backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={e => { onImportFile(e.target.files?.[0]); e.target.value = ''; }}
          />
        </div>
        {importErr && <span style={{ fontSize: 12.5, color: 'var(--red2)' }}>{importErr}</span>}
      </div>

      <div style={cardStyle}>
        <strong style={{ fontSize: 14.5, color: 'var(--t1)', fontWeight: 600 }}>Meus dados</strong>
        <span style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5 }}>
          Tudo fica salvo somente neste dispositivo (no seu navegador). Nada é enviado pra nenhum servidor.
        </span>
        <button
          onClick={actions.loadDemo}
          style={{ width: '100%', padding: 13, background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 14, color: 'var(--green)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
        >
          Carregar dados de exemplo
        </button>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            style={{ width: '100%', padding: 13, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 14, color: 'var(--red)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
          >
            Apagar todos os dados
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: 'var(--red)' }}>Tem certeza? Isso apaga tudo e volta pro início.</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setConfirmReset(false); actions.resetAll(); }}
                style={{ flex: 1, padding: 12, background: 'var(--red)', border: 'none', borderRadius: 12, color: '#450A0A', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter'" }}
              >
                Sim, apagar tudo
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                style={{ flex: 1, padding: 12, background: 'var(--w6)', border: '1px solid var(--w12)', borderRadius: 12, color: 'var(--t2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter'" }}
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
