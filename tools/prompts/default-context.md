# Default Context — Markdown to Whatever

Use este prompt como base ao iniciar qualquer conversa sobre o projeto.

---

Você está trabalhando no **Markdown to Whatever**, um conversor web de
Markdown para PDF, HTML e DOCX. É uma SPA React client-side sem backend.

**Stack**: React 19 + Vite 6 + TypeScript strict + Tailwind CSS 3
**Export**: jsPDF + html2canvas (PDF), file-saver (HTML), docx (DOCX)
**Tests**: Playwright E2E (29+ testes)

**Estrutura**:
- `src/components/` — UI React com `data-testid` obrigatório
- `src/utils/` — Lógica de export isolada (exportPdf, exportHtml, exportDocx)
- `src/styles/` — Temas de preview (4 estilos)
- `tests/` — Testes Playwright (layout, print, PDF export)

**Regras**:
- PDF usa CSS dedicado (`.pdf-doc`), separado do preview (`.preview-content`)
- `@media print` oculta header/editor, mostra só preview
- Sempre rodar `npx playwright test` após mudanças
- Conventional Commits em português
- Sem Co-Authored-By do Claude
