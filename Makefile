# ========================================
# ANSI Color Escape Codes
# YELLOW='\033[0;33m'
# RED='\033[0;31m'
# GREEN='\033[0;32m'
# NONE='\033[0m'
# ========================================

SRC_FILES := $(shell find src -type f)

.PHONY: all images artifacts packages git-hooks

all: images artifacts packages git-hooks

# ========================================
# Images
# ========================================

images: .made/gm-ui

.made/gm-ui: dist/gm-catalogue-builder/browser/index.html
	docker build -t gm-ui:dev -f Dockerfile-distonly .
	mkdir -p ./.made	# Ensure existence
	touch ./.made/gm-ui	# Timestamp file
	docker compose down ui	# Teardown out of date containers

# ========================================
# Artifacts
# ========================================

artifacts: dist/gm-catalogue-builder/browser/index.html

dist/gm-catalogue-builder/browser/index.html: node_modules $(SRC_FILES)	## rebuild on src/ changes
	prettier --write .
	ng lint --fix
	ng build --configuration development

# ========================================
# Packages
# ========================================

packages: node_modules

node_modules:	package.json package-lock.json	## download & install dependencies
	npm install

# ========================================
# Git Hooks
# ========================================

git-hooks: .git/hooks/pre-commit

.git/hooks/pre-commit: scripts/pre-commit.sh	## updates the pre-commit hook in the local repository
# Commits must pass linting and keep the build green
# [Git Hook](https://git-scm.com/book/ms/v2/Customizing-Git-Git-Hooks)
	@if [ -f .git/hooks/pre-commit ]; then \
		printf '\n\033[0;31m%s\033[0m\n\n' 'Pre-existing Pre-Commit Hook:'; \
		cat .git/hooks/pre-commit; \
	fi
	cat scripts/pre-commit.sh > .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit	# Ensure the script is executable.
	@printf '\n\033[0;33m%s\033[0m\n\n' "Pre-Commit Hook added:"
	@cat .git/hooks/pre-commit
	@printf '\n\033[0;33m%s\033[0m\n\n' "The Pre-Commit Hook can be removed with 'rm .git/hooks/pre-commit'"
