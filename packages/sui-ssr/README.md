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

## User the ssr output as stream

It use the stdout stream so you can do things like:

```ssh
  $ sui-ssr archive > ./myFileNameOrWhatever.zip
```

## Hooks

If you want change the server´s behavior for very specific business operation like handler error or logging. You must to use the hooks concept.

To do that define a file `src/hooks.js` this file must be something like this:

```
import TYPES from '@s-ui/ssr/hooks-types'

export default {
  [TYPES.LOGGING]: (req, res, next) => {
    console.log(req.url)
    next()
  }
}
```

Here we are define a logger to the console directly. Each hook type could be or a middleware function or an array of middlewares functions.

You can checks with hooks there is avalible in the hooks-types.js file.

There is two default hooks for 404 and 500 errors. both will look for a 404.html or 500.html file in the src folder and show this file. If you dont define this files, you will get an generic error page.

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
