# ADR-0002: Adicionar estilos @media print

## Status

**Aceito** — 2025-03-08

## Context

Ao imprimir a página via browser (Ctrl+P), o conteúdo saía em branco.
O layout flex com `height: 100%`, `min-h-0` e `overflow-hidden` restringia
o conteúdo à viewport, cortando tudo na impressão.

## Decision

Adicionar regras `@media print` em `src/index.css` que:
- Resetam `height: auto` e `overflow: visible`
- Ocultam header, editor e toasts (só preview é impresso)
- Mudam layout de `flex` para `block`
- Removem label "Preview"

## Consequences

- Impressão via browser funciona corretamente
- Testes Playwright com `emulateMedia('print')` validam o comportamento
- Seletores usam `data-testid` que já existiam nos componentes
