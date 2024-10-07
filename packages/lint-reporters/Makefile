.PHONY: lib umd
OWNER=Web Platform <enablers-frontend@adevinta.com>

SHELL := /bin/bash
.DEFAULT_GOAL := help

TEST_FLAG ?=
TEST_FLAG_SERVER ?=

lib: ## Build the library
	@rm -Rf ./lib
	@npx sui-js-compiler

umd: ## Bundle the reporter scripts to send sui-lint metrics to DD
	rm -Rf ./umd && mkdir ./umd
	npx esbuild ./src/sui-lint-js-reporter.js --bundle --platform=node --target=node10.4 > ./umd/sui-lint-js-reporter.bundle.js
	npx esbuild ./src/sui-lint-repository-reporter.js --bundle --platform=node --target=node10.4 > ./umd/sui-lint-repository-reporter.bundle.js

prepublishOnly: lib umd ## Build the Library before publish the package

lint: ## Lint and fix JS/TS code
	npx sui-lint js --fix

test: test_server ## Run client and server tests

test_server: ## run server tests
	STAGE=test npx sui-test server $(TEST_FLAG) $(TEST_FLAG_SERVER)

test_server_watch: ## run server test in watch mode
	TEST_FLAG=--watch $(MAKE) test_server

help: ## show help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

