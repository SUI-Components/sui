OWNER=Carlos Villuendas <carlos.villuendas@schibsted.com>

ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

VERSION=`grep version package.json | cut -c 15- | rev | cut -c 3- | rev`
CYPRESS_VERSION=`grep cypressVersion package.json | cut -c 22- | rev | cut -c 3- | rev`

DOCKER_IMAGE=suitools/test
DOCKER_IMAGE_VERSION=$(DOCKER_IMAGE):$(VERSION)

.PHONY: build login help
.DEFAULT_GOAL := help

build: login ## Build and push Docker images
	docker build --build-arg CYPRESS_VERSION -t $(DOCKER_IMAGE_VERSION) $(ROOT_DIR)
	docker tag $(DOCKER_IMAGE_VERSION) $(DOCKER_IMAGE):latest
	docker push $(DOCKER_IMAGE)

login: ## loging to docker registry using env vars (exported locally or injected by travis)
	echo "$(DOCKER_PASSWORD)" | docker login -u "$(DOCKER_USERNAME)" --password-stdin

help: ## show help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
