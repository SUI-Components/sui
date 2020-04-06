FROM cypress/base

WORKDIR /usr/src

RUN npm install --force-only @s-ui/test

ENTRYPOINT ["npx", "sui-test", "e2e"]
