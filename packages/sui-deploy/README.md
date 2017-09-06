# sui-deploy

> CLI to deploy of sui-based projects.


It provides:
* Common way to deploy our projects
* SPA deployment in now.sh


## Installation

```sh
$ npm install @s-ui/sui-deploy --save-dev
```

## CLI

When installed, a new CLI `sui-deploy` (node_modules/.bin/sui-deploy) is automatically available to deploy your projects.

Deploy a folder as an static SPA:

```sh
$ sui-deploy spa <name-of-project> <build-folder>
```

## Authentification

`sui-deploy` needs a now token to deploy files. The token is obtain from the env variable `NOW_TOKEN`

You can set your token once with a simple command.

```sh
$ export NOW_TOKEN=my-token-from-now
```

## Help

Run the following command for further options:
```sh
$ sui-deploy help
```

or

```sh
$ sui-deploy spa --help
```

## Example package.json

```json
{
  "name": "@my-scope/test-project",
  "version": "1.0.0",
  "scripts": {
    "build": "sui-bundler build -C",
    "deploy": "sui-deploy spa test-project ./build"
  },
  "devDependencies": {
    "@s-ui/sui-deploy": "1"
  }
}
```

To deploy your project:
```sh
$ npm run build; npm run deploy
```
