FROM cypress/base

WORKDIR /usr/src

RUN npm install --force-only @s-ui/test cypress@3.0.3

ENTRYPOINT ["npx", "sui-test", "e2e", "--baseUrl", "http://localhost:3000"]
