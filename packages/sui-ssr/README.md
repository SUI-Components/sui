# sui-ssr

> Plug SSR to you SUI SPA.

SSR can be tought to configure and maintain. SSR handles that for you providing:

- SSRaaS Server-Side Rendering as a Service
- Server improvements shared accross projects

## Installation

```sh
npm install @s-ui/ssr --save
```

## Development

Starts a development server.

```
Usage: sui-ssr-dev [options]

Options:
  -L, --link-all [monorepo]     Link all packages inside of monorepo multipackage
  -l, --link-package [package]  Replace each occurrence of this package with an absolute path to this folder (default: [])
  -h, --help                    display help for command

Examples:

  $ sui-ssr dev
  $ sui-ssr dev --link-package ./domain --link-all ./components
```

## Build

Generate a static version of the server w/out dependencies in the server folder.

```
Usage: sui-ssr-build [options]

Options:

  -C, --clean    Remove build folder before create a new one
  -V, --verbose  Verbose output
  -h, --help     output usage information

Examples:

  $ sui-ssr build
```

## Archive

Create a zip file with all assets needed to run the server in any infra.

It will, over parameter, make that the express server run over a username and password in a htpasswd way.

```
Usage: sui-ssr-archive [options]

Options:

  -C, --clean                             Remove previous zip
  -R, --docker-registry <dockerRegistry>  Custom registry to be used as a proxy or instead of the Docker Hub registry
  -E, --entry-point                       Relative path to an entry point script to replace the current one -> https://bit.ly/3e4wT8C
  -h, --help                              Output usage information
  -A, --auth <username:password>          Will build the express definition under authentication htpassword like.
  -O, --outputFileName <outputFileName>   A string that will be used to set the name of the output filename. Keep in mind that the outputFilename will have the next suffix <outputFileName>-sui-ssr.zip

Examples:

  $ sui-ssr archive
  $ sui-ssr archive --outputFileName=myFile // output: myFile-sui-ssr.zip
```

### IMPORTANT!!

If no outputFileName is provided it will pipe the standard output stream `process.stdout`

### Custom Entrypoint

In most scenarios the default configuration of the Dockerfile should be sufficient to start the sui-ssr server. But it is possible that in some more extreme cases, you will need to do some work inside the container before you start the server.
For those extreme cases you can use the `--entry-point` option in the `archive` command. You have to provide the path to an "executable" file that will do the ENTRYPOINT functions of your container.

Changing this, can be very dangerous and you have to know very well what you are doing, or you can leave the server unusable. Above all, do what you do, make sure you run whatever you get as arguments to the script. Because this will be the default command for the container

Here is an example of a possible script. It deletes a series of Environment Variables using a RegExp, before starting the server. Notice the last line, how we make sure to execute what comes to it by arguments

```sh
#!/usr/bin/env sh

FILTER="^FOO_|^BAR_"

for var in $(printenv | grep -E "$FILTER"); do
    unset "$var"
done

echo "System Env variables after filter:"
printenv

exec "$@"
```

## Release

If you want release your server to a branch (generate a clean package-lock file and tag) you can use this command:

```
$ npx sui-ssr release --email bot@email.com --name BotName
```

To use this command you have to define a `GITHUB_TOKEN` env var in your CI server. This token must be associate to the user and email passing by flags to the command

Example of a `.travis.yml`:

- Avoid jobs for branch with the format `vX.Y.Z`
- Avoid execute the release job if the commit has a tag associated
- Avoid execute the deploy jobs if the commit has not a tag associated
- Avoid a global install

```yml
sudo: required

language: node_js

dist: xenial

node_js:
  - '10'

before_install:
  - npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN

install:
  - true

branches:
  except:
    - /^v\d+\.\d+\.0$/

jobs:
  include:
    - stage: release
      if: branch = master AND NOT type = pull_request
      env: NODE_ENV=production
      before_install:
        - set -e
        - 'if [ ! -z $(git tag --points-at $TRAVIS_COMMIT) ]; then travis_terminate; fi'
      script:
        - npx @s-ui/ssr release --email srv.scms.jarvis@schibsted.com --name J.A.R.V.I.S
    - stage: deploy
      if: branch = master AND NOT type = pull_request
      env: NODE_ENV=development
      before_install:
        - set -e
        - 'if [ -z $(git tag --points-at $TRAVIS_COMMIT) ]; then travis_terminate; fi'
      name: 'Deploy dev'
      script:
        - echo "Esto construye $NODE_ENV con la versión $TRAVIS_TAG ($TRAVIS_COMMIT_MESSAGE)"
        - npm install surge
        - npm install --only pro
        - npm install --only dev
        - npm run ssr:deploy:development
    - #stage: deploy pro
      env: NODE_ENV=production
      before_install:
        - set -e
        - 'if [ -z $(git tag --points-at $TRAVIS_COMMIT) ]; then travis_terminate; fi'
      name: 'Deploy pro'
      script:
        - echo "Esto construye $NODE_ENV con la versión $TRAVIS_TAG ($TRAVIS_COMMIT_MESSAGE)"
        - npm install surge
        - npm install --only pro
        - npm install --only dev
        - npm run ssr:deploy:production
```

> If you want that release commit does not trigger a Travis build you could use the flag `--skip-ci` and commit message will have `[skip ci]` string. See more information about [Travis skipping build docs](https://docs.travis-ci.com/user/customizing-the-build/#skipping-a-build)

## Use the ssr output as stream

It uses the stdout stream so you can do things like:

```ssh
  $ sui-ssr archive > ./myFileNameOrWhatever.zip
```

## ENV Vars:

- VERBOSE: Print in the console info about the criticalCSS middleware
- CONSOLE: By default the console is disabled if you want to watch your `console.log` set up this env var to true set up this env var to true

```
$ VERBOSE=true CONSOLE=true node server/index.js
```

## Hooks

If you want to change the server´s behavior for very specific business operation like handling errors or logging you must use hooks.

To do that define a file `src/hooks.js` which will look as follows:

```
import TYPES from '@s-ui/ssr/hooks-types'

export default {
  [TYPES.LOGGING]: (req, res, next) => {
    console.log(req.url)
    next()
  }
}
```

Here we implement a direct log into the console. Each hook type could be a middleware function or an array of middlewares functions.

You can check which hooks are available in the hooks-types.js file.

There are two default hooks for 404 and 500 errors. both will look for a 404.html or 500.html file in the src folder and show this file. If you dont define this files, you will get a generic error page.

## Config server

If you need it, you will be able to config several aspects of your server. All your customs config must live under "config.sui-ssr" key in the package.json of your SPA.

For example:

```js
"config": {
  "sui-ssr": {
    "forceWWW": true
  }
}
```

Configs accepted:

- **`forceWWW`** (`false`): If you set up to true, then when you have a request from `yoursite.com` the server will respond with a 301 to `www.yoursite.com`. But any subdomain in the original request will be respected.

- **`earlyFlush`** (`true`): Set it to true in favor of TTFB with the potencial risk of returning soft 404s (200 when the page is not found). Set it to false in order to wait for getInitialProps() result (may throw a 404 error or any other error that will be used to define the proper HTTP error code in the response header) before flushing for the first time.

- **`useLegacyContext`** (`true`): If you don't want to use the legacy context you have to set this flag to `false`. If you leave it as default, you'll be still using the legacy context but also the new one in order to be able to migrate your code easily.

- **`multiSite`** (`undefined`): Should be an object containing a mapping with an association of hostname or hostname pattern (key as string) and the site name (value) in order to make your server work with more than one public folder. **Important! You must set at least a `default` value to enable this feature.** See one simple example below:

  ```json
  {
    "multiSite": {
      "my-motorcycles.com": "motorcycles",
      "my-trucks.com": "trucks",
      "v([0-9]+).my-trucks.com": "trucks",
      "default": "cars"
    }
  }
  ```

  Once this set is done, if you want to test your server in `localhost` you must run it setting the custom header `'X-Serve-Site'` (with the value of your desired site) to the request. If you're a Google Chrome user, you can achieve it by installing the extension [ModHeader](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj).

- **`createStylesFor`** (`undefined`): Define how the server should manage style imports. When separate styles per page, by default those imports will load css asynchronously but maybe we want that server to add them as an `<link>` in app head and be async or not depends on criticalCSS.

  - **`appStyles`** (`string`): Define the webpackChunkName of app styles. These styles usually are imported in `app.js`.
  - **`createPagesStyles`** (`false`): Define if pages have style imports that should be managed by the server. The server will get these files from the `asset-manifest.json` file, which should be created by sui-ssr.

> ⚠️ `createStylesFor` does not works as expected when sui-bundler configuration has `onlyHash` defined to `true`.

- **`SSL`** (`undefined`): This is only for local development. It should be usefull to test locally pointing to production endpoints. Certificate should help to avoid CORS issues. This prop should receive and object with the following structure:

  ```json
  {
    "SSL": {
      "development": {
        "key": "./.ssl/key.pem", // replace this with the path to the certificate key file
        "crt": "./.ssl/crt.pem" // replace this with the path to the certificate crt file
      }
    }
  }
  ```

## Critical CSS

For development you will need start the server with env vars `CRITICAL_CSS_HOST` and `CRITICAL_CSS_PROTOCOL` to allow to the external service request your current page.

If you have in your package.json the flag `criticalCSS: true` but you want to disable it in development. You can use the env var `DISABLE_CRITICAL_CSS=true` when you start your server.

## Render Head tags

This package uses [@s-ui/react-head](https://github.com/SUI-Components/sui/tree/master/packages/sui-react-head) to put custom HTML in your header.

## Context Providers

In order to be able to render context providers from the server side that are global to your web application, create a new file called `web-app/src/contextProviders.js` that returns an array containing each context `{provider, props}` pair. For example:

```js
// src/contextProviders.js
import {AdvertisingProvider} from '@adv-ui/adit-saitama-context-advertising'

export default [
  {
    provider: AdvertisingProvider,
    props: {
      site: 'xx',
      environment: 'dev'
    }
  }
]
```

### Shared context data between server and client

In case you need to share initial client data needed by a context provider, add an `getInitialData` to your context provider. It will be injected into the html as `window.__INITIAL_CONTEXT_VALUE__[you context key]`

## Link Packages

If you want you can link packages when you create a new static version of your site. But if you are using `sui-bundler` to link packages too. Please be sure to be in sync with the packages linkeds in both tools
For example, you could use a bash command like this:

```bash
#!/bin/bash

FLAGS="\
  --link-package ../../frontend-ma--uilib-components/components/value/proposition/ \
  --link-package ../../frontend-ma--uilib-components/components/banner/carsCampaign \
  "
CDN=/ npx sui-bundler build -C $FLAGS && \
  npx sui-ssr build -C $FLAGS && \
  PORT=5000 node server/index.js

```

## Environment variables

You can define environment variables by creating a yml file called `public-env.yml` in your SPA root directory:

```
API_ENDPOINT: https://api.pre.somedomain.com
SOME_OTHER_ENV_VAR: https://pre.somedomain.com/contact
```

- Whatever you add in this file will be available in your context factory as `appConfig.envs` param.
- This file must not contain secrets as it is meant to be available in both server and client side.
- :warning: And of course, this file is not meant to be versioned.

## Server Side Redirects

SUI-SSR allows any kind of redirects (3XX) in server side rendering when combined with SUI-REACT-INITIAL-PROPS.
Check out its [documentation](https://github.com/SUI-Components/sui/tree/master/packages/sui-react-initial-props#response-2) to get detailed information and an implementation example.

## Server Side Htpp-Cookie

SUI-SSR allows to set an Http-Cookie in server side rendering when combined with SUI-REACT-INITIAL-PROPS.
Check out its [documentation](https://github.com/SUI-Components/sui/tree/master/packages/sui-react-initial-props#response-2) to get detailed information and an implementation example.

## Server Side Headers

SUI-SSR allows to set a response headers in server side rendering when combined with SUI-REACT-INITIAL-PROPS.
Check out its [documentation](https://github.com/SUI-Components/sui/tree/master/packages/sui-react-initial-props#response-2) to get detailed information and an implementation example.

## Use the ssr in a lambda function

If you want, you can use the output of build inside a aws lambda function. To to that we recomend use [UP](https://up.docs.apex.sh)
Maybe you want to use a config like this:

```
{
  "name": "[YOUR APP NAME]",
  "profile": "[YOUR AWS PROFILE]",
  "hooks": {
    "prebuild": "rm ./node || true && wget https://s3.eu-west-3.amazonaws.com/nodejs-8.9.4/node && chmod a+x ./node",
    "clean": "npx rimraf ./{server,public,node}"
  },
  "stages": {
    "development": {
      "proxy": {
        "command": "NODE_ENV=development ./node ./server"
      }
    },
    "staging": {
      "hooks": {
        "build": "NODE_ENV=preproduction sui-bundler build -C && sui-ssr build -C"
      },
      "proxy": {
        "command": "NODE_ENV=preproduction ./node ./server"
      }
    },
    "production": {
      "hooks": {
        "build": "NODE_ENV=production sui-bundler build -C && sui-ssr build -C"
      },
      "proxy": {
        "command": "NODE_ENV=production ./node ./server"
      }
    }
  },
  "proxy": {
    "timeout": 5,
    "command": "./node ./server"
  },
  "lambda": {
    "memory": 1024
  }
}
```

# Next Steps:

**Stop compiling s-ui/ssr**
⚠️ `sui-ssr build` is going to be deprecated in some following major version:

- With that we could delete mime version of package json. Added because webpack does not get correctly mime version and could cause server errors. It is an express dependency.
