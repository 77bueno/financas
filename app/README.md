# Finanças — app

Código-fonte da plataforma (React 19 + TypeScript + Vite 8 + vite-plugin-pwa).

```bash
npm install
npm run dev        # desenvolvimento — http://localhost:5173/financas/
npm run build      # typecheck + build de produção + service worker
npm run preview    # serve o build localmente
npm run lint       # oxlint
```

Documentação completa (fluxos do usuário, arquitetura, modelo de dados, regras de cálculo, PWA e deploy): [`../docs/DOCUMENTACAO.md`](../docs/DOCUMENTACAO.md).

Mapa rápido do código:

- `src/state/` — fonte de verdade: tipos, estado inicial/demo, store (ações + persistência + snapshots mensais) e `derived.ts` (todos os valores calculados exibidos na UI)
- `src/screens/` — uma tela por arquivo (Home, Spend, Txns/extrato, Invest, Goals, Wealth, Plan, Year, Profile, Onboarding)
- `src/components/` — header, tab bar, hub do "+", folhas de criar/editar, campo de valor, toast
- `src/utils/format.ts` — formatação BRL, parsing de dígitos e datas
