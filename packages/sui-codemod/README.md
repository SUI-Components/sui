# sui-codemod

This repository contains useful [`jscodeshift`](jscodeshift) tranformation scripts.

## Usage

To use a transformation, you need to call the CLI and pass as a first parameter the name of the transformation you want to perform:
```
sui-codemod [transformation]
```

For example, for using the `contextByProps` transformation, you need to execute the next command:
```
sui-codemod contextByProps
```

## CLI Options

`-d`, `--dry`: Don't apply changs but logs which changes will be mades
`-p <pattern>`, `--path <pattern>`: Root path to locate the component

## Transformations avaiable

### `contextByProps`

Move from old React context API to the new one, moving context to props and separating the component in two files: one `index.js` with the Context.consumer wrapped and another `component.js` with the component using the context from props.


<!-- Links -->
[jscodeshift]: https://github.com/facebook/jscodeshift
