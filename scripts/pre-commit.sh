#!/bin/sh
# Note: Run from repository root, not the ./scripts dir.

# or the path to the Angular CLI tool.
NG=ng

# ANSI Color Escape Codes
# YELLOW='\033[0;33m'
# RED='\033[0;31m'
# GREEN='\033[0;32m'
# NONE='\033[0m'

printf  '\n\n\033[0;33m%s\033[0m\n' "Checking Format..."
if ! prettier --check .; then
  printf '\n\n\033[0;31m%s\033[0m\n\n' "[Dirty] Format check failed! (Hint: --write & restage)"
  exit 1
fi
printf  '\n\n\033[0;32m%s\033[0m\n\n' "[Clean] Format OK."

printf  '\n\n\033[0;33m%s\033[0m\n' "Linting..."
if ! $NG lint; then
  printf '\n\n\033[0;31m%s\033[0m\n\n' "[Dirty] Lint failed!"
  exit 1
fi
printf  '\n\n\033[0;32m%s\033[0m\n\n' "[Clean] Lint OK."

printf  '\n\n\033[0;33m%s\033[0m\n' "Building..."
if ! $NG build; then
  printf '\n\n\033[0;31m%s\033[0m\n\n' "[Red] Build failed!"
  exit 1
fi
printf  '\n\n\033[0;32m%s\033[0m\n\n' "[Green] Commit OK. (Hint: --no-verify for quick amending)"

unstaged_files=$(git diff --name-only)
if [ -n "$unstaged_files" ]; then
  (printf '%s\n\n' "Unstaged Changes: (Hint: Q to exit)"; printf '%s\n' "$unstaged_files") | less
fi
