# Skill: Release

## Purpose

Preparar release versionada com changelog e deploy.

## Trigger

- `/release` ou "prepara uma release"

## Steps

### 1. Version Bump

Analisar commits desde a última tag:

| Prefixo | Bump |
|---------|------|
| `fix:` | PATCH |
| `feat:` | MINOR |
| `feat!:` / `BREAKING CHANGE:` | MAJOR |

### 2. Pre-Release Checklist

- [ ] `npx tsc -b` sem erros
- [ ] `npx vite build` gera dist/ corretamente
- [ ] `npx playwright test` — todos os testes passam
- [ ] PDF export gera arquivo com conteúdo (> 10KB)
- [ ] Print mostra apenas preview
- [ ] Layout sem blocos brancos inconsistentes

### 3. Changelog

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- feat: descrição

### Fixed
- fix: descrição
```

### 4. Tag e Push

```bash
npm version <major|minor|patch>
git push origin main --tags
```

### 5. Deploy

Seguir `docs/runbooks/deployment.md`.

## Output Format

```markdown
## Release: vX.Y.Z

### Changelog
<changelog gerado>

### Checklist
- [x] Build OK
- [x] Tests passing (29/29)
- [x] PDF export validado
- [ ] Deploy concluído
```
