# Finanças 🪙

Plataforma de organização financeira pessoal — contas, gastos com descrição livre, categorias próprias, investimentos, metas, planejamento do mês e histórico de patrimônio. Funciona como site responsivo e como app instalável (PWA), 100% no dispositivo (sem servidor, sem login).

**➜ Acesse: https://77bueno.github.io/financas/**

| | |
|---|---|
| 📖 **Documentação completa** (fluxos, arquitetura, regras de cálculo, deploy) | [`docs/DOCUMENTACAO.md`](docs/DOCUMENTACAO.md) |
| 💻 **Código do app** (React + TypeScript + Vite) | [`app/`](app) |
| 🚀 **Deploy** (GitHub Actions → GitHub Pages, automático na `main`) | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) |

## Rodar localmente

```bash
cd app
npm install
npm run dev    # http://localhost:5173/financas/
```

## Origem

O design nasceu de um protótipo do [Claude Design](https://claude.ai/design) (preservado em [`project/`](project), com as conversas em [`chats/`](chats)) e evoluiu para uma plataforma real: estado zerado preenchido pelo usuário, transações com descrição e categorias personalizadas, extrato com busca/filtros, edição e exclusão de tudo, perfil, e layout próprio para desktop.
