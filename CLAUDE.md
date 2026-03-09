# Project Instructions for Claude

## Project Overview

**Markdown to Whatever** — Conversor web de Markdown para PDF, HTML e DOCX.
Aplicação SPA client-side sem backend. Todo processamento ocorre no browser.

## Tech Stack

- **Language**: TypeScript (strict)
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS 3
- **Markdown**: marked (GFM)
- **PDF Export**: jsPDF + html2canvas
- **HTML Export**: file-saver
- **DOCX Export**: docx
- **Testing**: Playwright (E2E + visual)
- **Deploy**: GitHub Pages / Docker (Nginx)

## Architecture

```
src/
├── components/    # React UI (Header, EditorPane, PreviewPane, etc.)
├── hooks/         # Custom hooks (useDebounce, useToast)
├── styles/        # Preview theme CSS (previewStyles.ts)
├── types/         # TypeScript types (StyleType, ExportFormat)
└── utils/         # Export logic (exportPdf, exportHtml, exportDocx)
```

- **Split-pane layout**: Editor (left) + Preview (right), 50/50
- **Debounced preview**: 150ms delay via useDebounce
- **4 estilos**: Básico, Acadêmico, Técnico, Compacto
- **Export**: Cada formato tem util próprio em `src/utils/`

## Key Conventions

1. **Componentes**: Um por arquivo, named exports, `data-testid` obrigatório
2. **Estilos**: Tailwind inline, cores via `tailwind.config.js` (primary, secondary, accent, border, text)
3. **Exports**: Lógica isolada em `src/utils/`, sem side effects nos componentes
4. **PDF**: Usa CSS dedicado para PDF em `exportPdf.ts` (classe `.pdf-doc`), separado do preview
5. **Print**: `@media print` no `index.css` oculta header/editor, mostra só preview
6. **Nomes**: camelCase funções, PascalCase componentes, kebab-case arquivos não existe aqui (camelCase)
7. **Commits**: Conventional Commits em português (`feat:`, `fix:`, `chore:`)
8. **Sem Co-Authored-By**: Nunca incluir Claude como co-autor

## Constraints

- Client-side only — sem backend, sem API server
- Sem `any` — usar `unknown` e narrowing
- Sempre rodar `npx playwright test` antes de considerar tarefa completa
- Nunca modificar testes existentes sem justificativa
- Export PDF: container deve estar visível no DOM para html2canvas funcionar

## Out of Scope

- Syntax highlighting (sem Prism/Highlight.js)
- Import de arquivos .md (apenas digitação/colar)
- Autenticação ou persistência de dados
- SSR / Server-side rendering
