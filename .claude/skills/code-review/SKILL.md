# Skill: Code Review

## Purpose

Revisar código do Markdown to Whatever com foco em qualidade visual,
export correto e consistência de estilos.

## Trigger

- `/code-review` ou "revisa esse código"
- Aplicado a diff, arquivo ou PR

## Steps

### 1. Context

- Ler CLAUDE.md do projeto
- Identificar qual camada o código afeta (componente, util, estilo)

### 2. Correctness

- Lógica de export gera output correto?
- Estados do React estão consistentes?
- Debounce aplicado onde necessário?
- Tipos cobrem todos os casos?

### 3. Visual Consistency

- Tailwind classes seguem o design system (primary, secondary, accent)?
- Fundos consistentes entre painéis (sem blocos brancos)?
- `data-testid` presente em elementos testáveis?
- Print styles (`@media print`) mantidos?

### 4. Export Quality

- PDF container no DOM e visível para html2canvas?
- CSS do PDF usa classe `.pdf-doc` (não `.preview-content`)?
- HTML export inclui fonts e estilos inline?
- DOCX parser cobre todos os elementos Markdown?

### 5. Performance

- Debounce no preview (150ms)?
- `useMemo` para conversão Markdown e CSS?
- Sem re-renders desnecessários?

## Output Format

```markdown
## Review: <arquivo ou descrição>

### Findings

#### Critical
- [ ] <finding com arquivo:linha>

#### Suggestion
- [ ] <finding com arquivo:linha>

### Verdict
**APPROVE** | **REQUEST_CHANGES**
```
