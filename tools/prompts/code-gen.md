# Template: Code Generation

Use ao solicitar geração de código para este projeto.

---

## Request

Gerar: **[descreva o que precisa]**

## Constraints

- TypeScript strict, sem `any`
- React functional components com hooks
- Tailwind CSS para estilos
- `data-testid` em elementos interativos/testáveis
- Lógica de export em `src/utils/`, não nos componentes

## Context

- Módulo: `src/[components|utils|styles|hooks]/`
- Arquivos relacionados: [listar]
- Tipos envolvidos: [ver src/types/index.ts]

## Expected Output

1. Arquivo de implementação com tipos completos
2. Teste Playwright correspondente em `tests/`
3. Tipos novos em `src/types/index.ts` se necessário

## Quality Checklist

- [ ] Sem `any`
- [ ] `data-testid` nos elementos testáveis
- [ ] Componentes < 80 linhas
- [ ] Funções < 30 linhas
- [ ] `npx playwright test` passa
- [ ] `npx tsc -b` sem erros
