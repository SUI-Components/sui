FROM cypress/base

WORKDIR /usr/src

ARG CYPRESS_VERSION=3.2.0

RUN npm install --force-only @s-ui/test cypress@$CYPRESS_VERSION

ENTRYPOINT ["npx", "sui-test", "e2e"]
