# sui-deploy

> CLI to deploy of sui-based projects.


It provides:
* Common way to deploy our projects
* SPA deployments


## Installation

```sh
$ npm install @s-ui/deploy --save-dev
```

## CLI

When installed, a new CLI `sui-deploy` (node_modules/.bin/sui-deploy) is automatically available to deploy your projects.

Deploy a folder as an static SPA:

```sh
$ sui-deploy spa <name-of-project> [build-folder] [--now]
```

As spa is the default command, you can also:
```sh
$ sui-deploy <name-of-project> [build-folder] [--now]
```

## Authentification

**When --now option is set**, `sui-deploy` needs a now token to deploy files. The token is obtain from the env variable `NOW_TOKEN`

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
    "deploy": "sui-deploy test-project --now"
  },
  "devDependencies": {
    "@s-ui/deploy": "1"
  }
}
```

To deploy your project:
```sh
$ npm run build; npm run deploy
```
