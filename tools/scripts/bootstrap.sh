#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; exit 1; }

echo "========================================="
echo "  Markdown to Whatever — Bootstrap"
echo "========================================="
echo ""

# Node.js
if command -v node &>/dev/null; then
  NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VERSION" -ge 20 ]; then
    log "Node.js $(node -v)"
  else
    fail "Node.js 20+ required, found $(node -v)"
  fi
else
  fail "Node.js not found"
fi

# npm
command -v npm &>/dev/null && log "npm $(npm -v)" || fail "npm not found"

# Git
command -v git &>/dev/null && log "Git $(git --version | awk '{print $3}')" || fail "Git not found"

# Install deps
echo ""
echo "Installing dependencies..."
npm ci 2>/dev/null || npm install
log "Dependencies installed"

# Install Playwright browsers
echo ""
echo "Installing Playwright browsers..."
npx playwright install chromium
log "Chromium installed"

# Build
echo ""
echo "Building project..."
npx tsc -b && npx vite build
log "Build successful"

# Run tests
echo ""
echo "Running tests..."
npx playwright test
log "All tests passed"

# Validate structure
if [ -f tools/scripts/validate-structure.sh ]; then
  echo ""
  bash tools/scripts/validate-structure.sh
fi

echo ""
echo "========================================="
echo -e "  ${GREEN}Bootstrap complete!${NC}"
echo "========================================="
echo ""
echo "Next steps:"
echo "  npm run dev      — Start dev server"
echo "  npm test         — Run Playwright tests"
echo "  npm run build    — Production build"
