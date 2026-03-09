# Deploy Runbook — Markdown to Whatever

## Prerequisites

- [ ] Node.js 20+ e npm instalados
- [ ] `gh` CLI autenticado
- [ ] Testes passando: `npm test`

## Build

```bash
npm run build
```

O output vai para `dist/`. É um site estático (HTML + JS + CSS).

## Deploy via GitHub Pages

### Automático (push para main)

O GitHub Actions roda os testes Playwright e, se passarem, o deploy
pode ser feito via workflow adicional.

### Manual

```bash
npm run build
npx gh-pages -d dist
```

## Deploy via Docker

```bash
docker compose up -d --build
```

Usa Nginx para servir os arquivos estáticos na porta 80.

## Validação

- [ ] Acessar a URL e verificar que o editor carrega
- [ ] Digitar Markdown e confirmar que o preview renderiza
- [ ] Clicar "Baixar PDF" e verificar que o PDF tem conteúdo
- [ ] Clicar "Baixar HTML" e abrir o arquivo gerado
- [ ] Testar impressão (Ctrl+P) — só preview deve aparecer

## Rollback

Como é site estático, basta fazer deploy da versão anterior:

```bash
git checkout <tag-anterior>
npm run build
# Re-deploy dist/
```
