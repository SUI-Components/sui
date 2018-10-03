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
$ sui-deploy <name-of-project> [build-folder=./public] --now
$ sui-deploy spa <name-of-project> [build-folder=./public] --now
```

### `sui-deploy <name> [folder]`

Deploys given folder.
Handles:
* `docker run` if DockerFile is found.
* `npm run start` if package.json is found.
* `serve .` otherwise.


### `sui-deploy spa <name> [folder]`

Same as previous but deploys app as an SPA, adding the option of auth.
A static server is run but not found routes point to index.html to make SPAs routing to work.


### Options

#### `--now`

Only hosting service available. Deploys to now.sh

```sh
$ sui-deploy spa 'test-project' --now -p
```

Deploys to test-project.now.sh

#### `-a, --auth <user:password>` (only for spa)

HTTP authentication user and pass separated by `:`.

```sh
$ sui-deploy spa test-project --now -a 'my-user:my-password'
```

#### `-p, --public`

Force skipping auth to make your deployment public.

**CAUTION:** if your deployment is public, it's also indexable by search engines.

```sh
$ sui-deploy spa test-project --now -p
```

#### `-b, --branch`

Append git branch name to deploy name.

```sh
$ sui-deploy spa test-project --now -b -a 'my-user:my-password'
```

If your branch is `my-feature`, your code will be deployed to test-project-my-feature.now.sh

### `-e, --environmentVars`

Append multiple env vars that will be passed to our deployer

```sh
$ sui-deploy spa test-project --now -b -a 'my-user:my-password' -e NODE_ENV=preproduction -e GH_AUTH_TOKEN=secret
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
    "deploy": "sui-deploy spa test-project --now -a 'my-user:my-password'"
  },
  "devDependencies": {
    "@s-ui/deploy": "2"
  }
}
```

To deploy your project:

```sh
$ npm run build; npm run deploy
```
