# =============================================================================
# configs:/makefiles/v1.2.0;/angular/v1.1.0
# =============================================================================

# See [7.2.1 General Conventions for Makefiles](https://www.gnu.org/prep/standards/html_node/Makefile-Basics.html)
SHELL := /bin/sh

init: project git	## default (no-arg) target to initialise the Project and local repository

# See [7.2.6 Standard Targets for Users > 'all'](https://www.gnu.org/prep/standards/html_node/Standard-Targets.html)
all: init docker angular	## primary target for creating all Project artifacts

start: docker serve	## start the Project (make stop)
	$(COMPOSE) start

stop: kill-serve	## stop the Project
	$(COMPOSE) stop

build: angular 	## build the Project

log:	## show logs of the Project
	tail $(MADE)/serve
	@printf '\033[0;36m\n%s\n\033[0m' "(Streaming Mode) tail -f $(MADE)/serve"

.PHONY: init all start stop build log
# =============================================================================
# Environment Variables
# =============================================================================
# [6.2.4 Conditional Variable Assignment](https://www.gnu.org/software/make/manual/html_node/Conditional-Assignment.html)
# [6.10 Variables from the Environment](https://www.gnu.org/software/make/manual/html_node/Environment.html)
COMPOSE ?= docker compose
NPM ?= npm
NPX ?= npx
ANGULAR ?= npx ng
# =============================================================================
# Script Macros
# =============================================================================
STOP_PROCESS := ./.scripts/stop-process.sh

define stop_process	##> Given the PID file, stop the process
@if [ -f "$(1)" ]; then \
	xargs --no-run-if-empty --arg-file "$(1)" "$(STOP_PROCESS)"; \
fi
endef
# =============================================================================
# Project
# =============================================================================
MADE := ./.made

project: $(MADE) $(MADE)/stop-script	##> alias for initialising the Project

$(MADE):
	mkdir $(MADE)

# See [4.3 Types of Prerequisites](https://www.gnu.org/software/make/manual/html_node/Prerequisite-Types.html) > order-only-prerequisites
$(MADE)/stop-script: $(STOP_PROCESS) | $(MADE)	##> mark scripts executable
	chmod +x $(STOP_PROCESS)
	touch $(MADE)/stop-script

rm-project:	##> remove all Project initialisation artifacts
	rm -rf $(MADE)

.PHONY: project rm-project
# =============================================================================
# Git
# - [Git Hooks](https://git-scm.com/book/ms/v2/Customizing-Git-Git-Hooks)
# =============================================================================
DIFF_FILES := git diff HEAD --diff-filter=ACM --name-only --relative -z
UNTRACKED_FILES := git ls-files --others --exclude-standard --full-name -z

git: .git/hooks/pre-commit	##> alias for initialising the local repository; creates Git artifacts

.git/hooks/pre-commit: ./.scripts/pre-commit.sh	| $(MADE)	## updates the pre-commit hook in the local repository
	@if [ -f .git/hooks/pre-commit ]; then \
		cat .git/hooks/pre-commit >> $(MADE)/pre-commit; \
	fi
	cat .scripts/pre-commit.sh > .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit	# Ensure the script is executable.
	@printf '\n\033[0;33m%s\033[0m\n' "Pre-Commit Hook installed."
	@printf '\tHint:\t\033[0;36m%s\033[0m\n' "rm .git/hooks/pre-commit"
	@printf '\tHint:\t\033[0;36m%s\033[0m\n' "make rm-git"

rm-git:	##> remove all Git artifacts produced by this script
	rm -f .git/hooks/pre-commit
	@printf '\n\033[0;33m%s\033[0m\n' "Pre-Commit Hook removed."
	@printf '\tHint:\t\033[0;36m%s\033[0m contains any overwritten existing pre-commit hooks.\n' "$(MADE)/pre-commit"

.PHONY: git rm-git
# =============================================================================
# Docker
# =============================================================================
docker:	##> create all Docker artifacts
	$(COMPOSE) create

rm-docker:	##> remove all Docker artifacts produced by this script
	$(COMPOSE) down
	@printf '\nHint:\t\033[0;36m%s\033[0m\t (Prune volume data)\n' "$(COMPOSE) down --volumes"

.PHONY: docker rm-docker
# =============================================================================
# Angular
# =============================================================================
APP := dist/gm-catalogue-builder/browser/index.html
SRC_FILES := $(shell find src -type f)

angular: $(APP)	##> alias for creating all Angular artifacts

./node_modules: package.json package-lock.json	##> install, or update Project dependencies
	$(NPM) install

$(APP): ./node_modules $(SRC_FILES)	## build Angular Artifacts
	$(ANGULAR) build --configuration=development

rm-angular: kill-serve	##> remove all Angular artifacts produced by this script
	rm -rf ./node_modules/
	rm -rf ./dist/
	rm -f $(MADE)/serve
	rm -f $(MADE)/serve.pid

serve: $(APP) kill-serve | $(MADE)	##> start the Angular server
	$(ANGULAR) serve --no-watch --no-live-reload --host 0.0.0.0 > $(MADE)/serve 2>&1 & echo $$! > $(MADE)/serve.pid

kill-serve:	##> kill the Angular server process
	$(call stop_process,$(MADE)/serve.pid)

.PHONY: angular rm-angular serve kill-serve
# =============================================================================
# Linting
# =============================================================================
LINT := $(NPX) eslint --fix
LINT_CHECK := $(NPX) eslint

lint: lint-diff lint-untracked	## alias to run linting (lint-diff) (lint-untracked) rules
	git status -s

lint-diff: ./node_modules	##> run linting on modified (git diff HEAD) files
	$(DIFF_FILES) "./src/" | xargs -r -0 $(LINT)

lint-diff-check: ./node_modules	##> run linting on modified (git diff HEAD) files
	$(DIFF_FILES) "./src/" | xargs -r -0 $(LINT_CHECK)

lint-untracked: ./node_modules	##> run linting on untracked files
	$(UNTRACKED_FILES) "./src/" | xargs -r -0 $(LINT)

lint-all: ./node_modules	##> run linting on all files
	$(LINT) .

.PHONY: lint lint-diff lint-untracked lint-all
# =============================================================================
# Formatting
# =============================================================================
FORMAT := $(NPX) prettier --write
FORMAT_CHECK := $(NPX) prettier --check

TRIM_CHECK := xargs -0 grep -lZ '[[:blank:]]$$'
TRIM := $(TRIM_CHECK) | xargs -0 --no-run-if-empty sed -i 's/[ \t]*$$//'

format: format-diff format-untracked	## alias to run formatting (format-diff) (format-untracked) rules
	git status -s

format-diff: ./node_modules	##> run formatting on modified (git diff HEAD) files
	$(DIFF_FILES) | $(TRIM)
	$(DIFF_FILES) "./src/" | xargs -r -0 $(FORMAT)

format-diff-check: ./node_modules	##> check formatting on modified (git diff HEAD) files
	$(DIFF_FILES) "./src/" | xargs -r -0 $(FORMAT_CHECK)
	@TRAILING_WHITESPACE_FILES=$$($(DIFF_FILES) | $(TRIM_CHECK)); \
	if [ -n "$$TRAILING_WHITESPACE_FILES" ]; then \
		  printf '\033[0;31m%s\033[0m' "Trailing Whitespaces!"; \
		  printf '\t- %s\n' "$$TRAILING_WHITESPACE_FILES"; \
		exit 1; \
	fi

format-untracked: ./node_modules	##> run formatting on untracked files
	$(UNTRACKED_FILES) "./src/" | xargs -r -0 $(FORMAT)
	$(UNTRACKED_FILES) | $(TRIM)

format-all: ./node_modules	##> run formatting on all files
	find . -maxdepth 1 -type f -print0 | $(TRIM)
	$(FORMAT) .

.PHONY: format format-diff format-untracked format-all
# =============================================================================
# Utilities
# =============================================================================
# See [7.2.6 Standard Targets for Users > 'clean'](https://www.gnu.org/prep/standards/html_node/Standard-Targets.html)
clean: rm-project rm-git rm-docker rm-angular	## alias for cleaning up all artifacts produced by this Project

help:  ## show a summary of available targets
	@printf "%s\n" \
	"===============================================================================" \
	" General Commands" \
	"==============================================================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; { \
			cmd = $$1; desc = $$2; \
			gsub(/\(([^)]*)\)/, "\033[34m&\033[0m", desc); \
			printf "  \033[36m%-21s\033[0m %s\n", cmd, desc \
		}'
	@printf "%s\n" \
	"==============================================================================="

help-ext:  ## show all available targets
	@printf "%s\n" \
	"===============================================================================" \
	"Available Commands" \
	"==============================================================================="
	@grep -E '^[a-zA-Z0-9_-]+:.*?##>? ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?##>? "}; { \
			cmd = $$1; desc = $$2; \
			gsub(/\(([^)]*)\)/, "\033[34m&\033[0m", desc); \
			printf "  \033[36m%-21s\033[0m %s\n", cmd, desc \
		}'
	@printf "%s\n" \
	"==============================================================================="

.PHONY: clean help help-ext
# =============================================================================
# ANSI Color Escape Codes
# =============================================================================
# YELLOW='\033[0;33m'
# RED='\033[0;31m'
# GREEN='\033[0;32m'
# CYAN='\033[0;36m'
# BLUE='\033[0;34m'
# NONE='\033[0m'
# =============================================================================
