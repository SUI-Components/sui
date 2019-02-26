# sui-ssr

> Plug SSR to you SUI SPA.

SSR can be tought to configure and maintain. SSR handles that for you providing:

- SSRaS Server-Side Rendering as a Service
- Server improvements shared accross projects

## Installation

```sh
npm install @s-ui/ssr --save
```

## Build

Generate a static version of the server w/out dependencies in the server folder.

```
  Usage: sui-ssr-build [options]

  Options:

    -C, --clean    Remove build folder before create a new one
    -V, --verbose  Verbose output
    -h, --help     output usage information
  Description:

  Build a production ready ssr server

  Examples:

    $ sui-ssr build
```

## Archive

Create a zip file with all assets needed to run the server in any infra.

It will, over parameter, make that the express server run over a username and password in a htpasswd way.

```
  Usage: sui-ssr-archive [options]

  Options:

    -C, --clean  Remove previous zip
    -h, --help   output usage information
    -A, --auth <username:password> Will build the express definition under authentication htpassword like.
    -O, --outputFileName <outputFileName> A string that will be used to set the name of the output filename. Keep in mind that the outputFilename will have the next suffix <outputFileName>-sui-ssr.zip
  Description:

  Examples:

    $ sui-ssr archive

    $ sui-ssr archive --outputFileName=myFile // output: myFile-sui-ssr.zip
```

### IMPORTANT!!

If no outputFileName is provided it will pipe the standard output stream `process.stdout`

## Use the ssr output as stream

It uses the stdout stream so you can do things like:

```ssh
  $ sui-ssr archive > ./myFileNameOrWhatever.zip
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
    "criticalCSS": "true",
    "forceWWW": "true",
    "dynamicsURLS": ["\/legal/*"]
  }
}
```

Configs accepted:

* forceWWW (false): If you set up to true, then when you have a request from `yoursite.com` the server will respond with a 301 to `www.yoursite.com`. But any subdomain in the original request will be respected.

* earlyFlush (true): Set it to true in favor of TTFB with the potencial risk of returning soft 404s (200 when the page is not found). Set it to false in order to wait for getInitialProps() result (may throw a 404 error or any other error that will be used to define the proper HTTP error code in the response header) before flushing for the first time.

* loadSPAOnNotFound (false): Set it to true in order to read index.html file so that the SPA can handle 404 errors. Set it to false in order to load 404.html instead.

* criticalCSS (false): If you setup this flag to true, you will get this awesome feature for free. More about Critical CSS [here](https://www.smashingmagazine.com/2015/08/understanding-critical-css/)

## Dynamic Rendering

If you want to apply this new technique proposal by Google to improve your SEO and your site's performance you have to set up the entry *dynamicsURLS* in the config of the package json with an array of allowed urls. Each entry in this array must be a string and follow the structure of a RegExp constructor.

More info about Dynamic Rendering here: https://developers.google.com/search/docs/guides/dynamic-rendering


## Critical CSS

For development you will need start the server with env var `CRITICAL_CSS_HOST` to allow to the external service request your current page.

## Environment variables

You can define environment variables by creating a yml file called `public-env.yml` in your SPA root directory:

```
API_ENDPOINT: https://api.pre.somedomain.com
SOME_OTHER_ENV_VAR: https://pre.somedomain.com/contact
```

- Whatever you add in this file will be available in your context factory as `appConfig.envs` param.
- This file must not contain secrets as it is meant to be available in both server and client side.
- :warning: And of course, this file is not meant to be versioned.

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
