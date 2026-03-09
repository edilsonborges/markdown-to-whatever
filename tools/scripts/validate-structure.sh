#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

ERRORS=0

check() {
  if [ -e "$1" ]; then
    echo -e "  ${GREEN}OK${NC}  $1"
  else
    echo -e "  ${RED}MISS${NC}  $1"
    ERRORS=$((ERRORS + 1))
  fi
}

echo "Validating project structure..."
echo ""

# Root
check "CLAUDE.md"
check "README.md"
check "package.json"
check "tsconfig.json"
check "vite.config.ts"
check "tailwind.config.js"
check "playwright.config.ts"
check "index.html"

# Docs
check "docs/architecture.md"
check "docs/decisions/0001-substituir-html2pdf-por-jspdf.md"
check "docs/runbooks/deployment.md"

# Claude config
check ".claude/settings.json"
check ".claude/hooks/pre-commit.md"
check ".claude/hooks/post-edit.md"
check ".claude/skills/code-review/SKILL.md"
check ".claude/skills/refactor/SKILL.md"
check ".claude/skills/release/SKILL.md"

# Tools
check "tools/scripts/bootstrap.sh"
check "tools/scripts/validate-structure.sh"
check "tools/prompts/default-context.md"
check "tools/prompts/code-gen.md"

# Source
check "src/App.tsx"
check "src/main.tsx"
check "src/index.css"
check "src/components/Header.tsx"
check "src/components/EditorPane.tsx"
check "src/components/PreviewPane.tsx"
check "src/components/ExportButtons.tsx"
check "src/utils/exportPdf.ts"
check "src/utils/exportHtml.ts"
check "src/utils/exportDocx.ts"
check "src/styles/previewStyles.ts"
check "src/types/index.ts"

# Tests
check "tests/layout.spec.ts"
check "tests/pdf-export.spec.ts"

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo -e "${GREEN}All files present. Structure is valid.${NC}"
else
  echo -e "${RED}${ERRORS} file(s) missing.${NC}"
  exit 1
fi
