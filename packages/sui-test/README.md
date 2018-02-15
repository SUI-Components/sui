# sui-test
> Zero config testing tool

## Motivation

(1) Setup properly a testing env in JS is hard. There is a lot deps and is easy for us install differents setups in differents project. To avoid that now to run a test suit over your code you need install only one tool. 


## Folder Structure

Your tests must be in a `test` folder in your project root. Each test file should follow the patter: `*Spec.js`.

```
.
├── package.json <- Project package.json
└── src
│   ├── detail.js
│   └── user.js
└── test
    ├── detail
    │   └── detailSpec.js
    └── user
        └── userSpec.js
```

## Installation

```sh
npm install @s-ui/test
```

# CLI Options

```sh
  Usage: sui-test [options] [command]


  Options:

        --version  output the version number
    -h, --help     output usage information


  Commands:

    browser|b   Run tests in the browser
    server|s    Run tests in node
    help [cmd]  display help for [cmd]
```

## Browser options

```sh

  Usage: sui-test-browser [options]


  Options:

    -W, --watch  Run in watch mode
    -C, --ci     Run a Firefox headless for CI testing
    -h, --help   output usage information
  Description:

  Run tests in chorme

  Examples:

    $ sui-test-domain browser
```

## Server options

```sh
  Usage: sui-test-server [options]


    Options:

        -W, --watch  Run in watch mode
        -h, --help   output usage information
    Description:

    Run tests in node

    Examples:

      $ sui-test-domain server
```



## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

