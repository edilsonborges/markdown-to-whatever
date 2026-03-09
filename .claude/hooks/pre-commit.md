# Pre-Commit Hook

## Purpose

Validar qualidade do código antes de qualquer commit.

## Checks

### 1. Type Check

```bash
npx tsc -b
```

Bloqueia commit em qualquer erro de tipo.

### 2. Build

```bash
npx vite build
```

Garante que o projeto compila sem erros.

### 3. Testes Playwright

```bash
npx playwright test
```

Roda todos os testes E2E. Bloqueia commit se algum falhar.

### 4. Secret Scan

Verificar que nenhum arquivo staged contém tokens, chaves ou senhas.

## Failure Behavior

Em caso de falha, exibir:
- Qual check falhou
- O erro específico
- Comando para reproduzir
