# sui-dasboard

Show stats about the current sui--component usage in differents projects.

If you want to add or remove project, you have to edit the bin/sui-dashboard-component.js file.


## install:

`$ npm install @s-ui/dashboard`

## Docker:

`docker run -v ~/.ssh:/root/.ssh:ro -v ~/.npmrc:/root/.npmrc:ro node npx @s-ui/dashboard components`

## CLI:

```
Usage: sui-dashboard [options] [command]

Options:
      --version  output the version number
  -h, --help     output usage information

Commands:
  components     Update several metrics about sui-components
  help [cmd]     display help for [cmd]

```
