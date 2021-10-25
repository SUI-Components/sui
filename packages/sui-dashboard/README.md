# @s-ui/dashboard

Show stats about the current SUI-Components usage in differents projects.

If you want to add or remove a project, you have to edit the `bin/sui-dashboard-components.js` file.

## Usage:

`npx @s-ui/dashboard components`

If you want to get the results including versions you should use:

`npx @s-ui/dashboard components -- -v`

If you want to save a file with the result you can also use:

`npx @s-ui/dashboard components -- -o ./output.json`

Or simply combine both options:

`npx @s-ui/dashboard components -- -v -o ./output.json`

## CLI:

```
Usage: sui-dashboard [options] [command]

Options:
      --version  output the version number
  -h, --help     output usage information

Commands:
  components     Update several metrics about sui-components
    Options:
        -v --versions           output versions used
        -o --output <filename>  save result on filename
  help [cmd]     display help for [cmd]

```
