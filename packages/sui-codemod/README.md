# sui-codemod

This repository contains useful [`jscodeshift`](jscodeshift) tranformation scripts.

## `contextByProps`

Move from old React context API to the new one, moving context to props and separating the component in two files: one `index.js` with the Context.consumer wrapped and another `component.js` with the component using the context from props.

<!-- Links -->
[jscodeshift]: https://github.com/facebook/jscodeshift
