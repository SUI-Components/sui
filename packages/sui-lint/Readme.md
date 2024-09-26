# sui-lint

> CLI to lint your code and make it compliant.

It provides:

- Same js and sass style of code across all company.
- Linting rules a reference package, not duplicated linting config in every project.
- Implemented as a reusable CLI.

## Installation

```sh
$ npm install @s-ui/lint --save-dev
```

## CLI

When installed, a new CLI `sui-lint` is automatically available to lint your files according to SUI conventions.

### Lint JS files

```sh
$ sui-lint js [options]
```

It lints all `js|jsx` files in your project, excluding `.eslintignore` and `.gitignore` file patterns.

Same options available in [eslint](https://eslint.org/docs/user-guide/command-line-interface) except one: `-c, --config`. If you try to use this option, an exception will be thrown.

### Format JS files

```sh
$ sui-lint js --fix [options]
```

### Lint Sass files

```
$ sui-lint sass [options]
```

Lints all `**/src/**/*.scss` files in the project, excluding `node_modules`, `lib`, `dist`.

To change the default pattern you can use the flag `--pattern`:

example:

```
$ sui-lint sass --pattern ./widgets/**/*.scss
```

> **`.gitignore` file patterns are also excluded but interpretation may differ as only glob patterns are understood**

### Scope commands to staged files

```sh
$ sui-lint js --staged
$ sui-lint js --fix --staged
$ sui-lint sass --staged
```

Same command but applied only on staged files (obtained with `git diff --cached --name-only --diff-filter=d` command).

For integrations, prettier config is located in `@s-ui/lint/.prettierrc.js`.

### Add fixes to the stage

```sh
$ sui-lint js --staged --add-fixes
$ sui-lint js --fix --staged --add-fixes
```

This option can only be used with `--staged`.

In fix mode like with `sui-lint js --fix`, the `--add-fixes` option will stage the files again (`git add <file...>`)

It's usefull to make your code autoformat before any commit.

## IDE integration

Steps to integrate sui-lint with an IDE:

1.  Install (if needed) eslint/stylelint/prettier plugins in your IDE. For example, for Visual Studio Code, the recommended ones are:

    - [prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
    - [vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    - [stylelint](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint)

2.  After install the package, it will add automatically the needed configuration to your `package.json` file. If not, make sure you add these lines:

```json
{
  "eslintConfig": {
    "extends": ["./node_modules/@s-ui/lint/eslintrc.js"]
  },
  "stylelint": {
    "extends": "./node_modules/@s-ui/lint/stylelint.config.js"
  },
  "prettier": "./node_modules/@s-ui/lint/.prettierrc.js"
}
```

### Example package.json

```json
{
  "name": "test-project",
  "version": "1.0.0",
  "scripts": {
    "lint": "npm run lint:js && npm run lint:sass",
    "lint:js": "sui-lint js",
    "lint:sass": "sui-lint sass"
  },
  "devDependencies": {
    "@s-ui/lint": "3"
  },
  "eslintConfig": {
    "extends": ["./node_modules/@s-ui/lint/eslintrc.js"]
  },
  "stylelint": {
    "extends": "./node_modules/@s-ui/lint/stylelint.config.js"
  },
  "prettier": "./node_modules/@s-ui/lint/.prettierrc.js"
}
```

### Visual Studio Code and Prettier integration

Prettier is integrated in sui-lint with some specific rules. If you want VSCode to format your code exactly as `sui-lint js --fix` would do, keep reading:

#### prettier + eslint + stylelint = 🎉

`CMD + Shift + P -> Preferences: Open Settings (JSON)`.

Add the next config to your preferences:

```json
{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  }
}
```

It will format and fix the problems of linter on saving. If you prefer to do this manually, you could avoid adding the `eslint.autoFixOnSave` and `editor.formatOnSave` configs.

## Linting rules in detail

This section will guide you through some of the linting rules we are enforcing in the development of our front-end projects.

### Imports order and sorting

Respecting an ordering convention when dealing with dependencies imports allows to keep the code readable and well organized.

#### Order groups and convention

To maintain a certain hierarchical degree while importing dependencies, we want to keep them sorted from the farthest to the closest in terms of implementation, where the first imports will be the most generic dependencies and the latest listed will be siblings files or style imports.

Based on our infrastructure and most used dependencies, the imports groups are the following, ordered as they should be when imported:

- **Side effect and polyfill.**
- **`Node` built-in packages**: built-in dependencies in Node.js.
- **`react` related packages**: every package starting with the react term will be part of this group.
- **Standalone packages**: a group for any other standalone dependency not part of any organization (e.g classnames, uuid, etc.)
- **Generic organization packages**: any package part of a third-party organization.
- **S-UI & ADV-UI organization packages**: any package part of the cross components organization.
- **Relative imports**: put all the project relative imports, `./` last.
- **Style imports.**

#### Sorting automation

Sorting and respecting this convention could be painful due to how editors usually add automatically a necessary dependency.

To help keep this convention applied, the `@s-ui/lint` package, which is responsible for linting and holding a shared linter configuration, will warn you directly in your favourite editor if some imports are not respecting the defined configuration.

This allows also to automate the sorting process, since it's possible to configure your editor to automatically fix linting errors when saving a file, including sorting the imported dependencies.

In case is necessary to add a custom configuration for a project, it is still possible to override the defined configuration at the project level.

#### Example

❌ Unordered imports

```js
import {
  useSuiContext
  useCv,
} from '@adv-ui/ij-react-hooks'
import {Box} from '@adv-ui/ij-layout'
import {Heading} from '@adv-ui/ij-typography'
import controller from '../controller'
import AddButton from './AddButton'
import Drawer from '@s-ui/react-molecule-drawer'
import Button from '@s-ui/react-atom-button'
import {List, ListItem} from '@adv-ui/ij-list'
import uuid from 'uuid'
import PropTypes from 'prop-types'
import {useMemo} from 'react'
```

✅ Sorted imports

```js
import {useMemo} from 'react'

import PropTypes from 'prop-types'
import uuid from 'uuid'

import Button from '@s-ui/react-atom-button'
import Drawer from '@s-ui/react-molecule-drawer'

import {Box} from '@adv-ui/ij-layout'
import {List, ListItem} from '@adv-ui/ij-list'
import {useCv, useSuiContext} from '@adv-ui/ij-react-hooks'
import {Heading} from '@adv-ui/ij-typography'

import controller from '../controller'

import AddButton from './AddButton'
```
