# sui-ssr
> Plug SSR to you SUI SPA.

SSR can be tought to configure and maintain. SSR handles that for you providing:
* SSRaS Server-Side Rendering as a Service
* Server improvements shared accross projects

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

```
  Usage: sui-ssr-archive [options]

  Options:

    -C, --clean  Remove previous zip
    -h, --help   output usage information
  Description:

  Examples:

    $ sui-ssr archive
```

## Use the ssr in a lambda function

If you want, you can use the output of build inside a aws lambda function. To to that we recomend use [UP](https://up.docs.apex.sh)
Maybe you want to use a config like this:

```
{
  "name": "[YOUR APP NAME]",
  "profile": "[YOUR AWS PROFILE]",
  "hooks": {
    "prebuild": "rm ./node || true && wget https://s3.eu-west-3.amazonaws.com/nodejs-8.9.4/node && chmod a+x ./node",
    "clean": "rm -Rf ./{server,public,node}"
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
