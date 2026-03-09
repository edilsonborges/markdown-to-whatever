# Skill: Refactor

## Purpose

Reestruturar código existente sem alterar comportamento. Testes devem
continuar passando após cada mudança.

## Trigger

- `/refactor` ou "limpa esse código", "simplifica"
- Code review identifica problemas estruturais

## Steps

### 1. Avaliar

- Ler código-alvo e testes existentes
- Identificar o problema:
  - Componente muito grande (> 80 linhas)
  - CSS duplicado entre preview e PDF
  - Lógica de export misturada com UI
  - Estilos inline repetidos

### 2. Verificar Testes

```bash
npx playwright test
```

Se cobertura insuficiente, **escrever testes primeiro**.

### 3. Estratégia

| Problema | Ação |
|----------|------|
| Componente grande | Extrair sub-componentes |
| CSS duplicado | Unificar em previewStyles.ts |
| Lógica no componente | Mover para src/utils/ |
| Estilos repetidos | Extrair classes Tailwind |

### 4. Executar

- Uma mudança por vez
- `npx playwright test` após cada mudança
- Commit separado para cada passo

### 5. Validar

- Todos os 29+ testes passam
- `npx tsc -b` sem erros
- `npx vite build` sem erros

## Output Format

```markdown
## Refactor: <descrição>

### Problema
<O que foi identificado>

### Changes
1. <arquivo — o que mudou>

### Validação
- Tests: PASS (29 passing)
- Build: OK
```
