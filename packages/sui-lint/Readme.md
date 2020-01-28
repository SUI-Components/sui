# sui-lint

> CLI to lint your code and make it compliant.

It provides:

* Same js and sass style of code across all company.
* Linting rules a reference package, not duplicated linting config in every project.
* Implemented as a reusable CLI.

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

### Lint SASS files

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
    "extends": [
      "./node_modules/@s-ui/lint/eslintrc.js"
    ]
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
    "extends": [
      "./node_modules/@s-ui/lint/eslintrc.js"
    ]
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
