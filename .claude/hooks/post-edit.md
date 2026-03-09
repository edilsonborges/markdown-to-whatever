# Post-Edit Hook

## Purpose

Validar automaticamente após edições do Claude.

## Triggers

Roda após qualquer arquivo `.ts`, `.tsx` ou `.css` ser modificado.

## Checks

### 1. Syntax

```bash
npx tsc -b --noEmit
```

Verifica que o TypeScript compila.

### 2. Testes Relacionados

Se o arquivo editado está em `src/components/`, rodar testes de layout.
Se está em `src/utils/export*`, rodar testes de exportação PDF.

```bash
npx playwright test tests/layout.spec.ts
npx playwright test tests/pdf-export.spec.ts
```

### 3. Build

```bash
npx vite build
```

Confirma que o bundle gera sem erros.

## Output

- **PASS**: Tudo OK
- **WARN**: Build ok mas testes com warnings
- **FAIL**: Erros encontrados, sugerir correção
