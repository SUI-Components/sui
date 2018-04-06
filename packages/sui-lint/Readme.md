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

Then, you can do this:

```sh
$ sui-lint js --fix
```

### Format JS files

```sh
$ sui-lint format-js [options]
```

It uses prettier to format your files. As prettier config may differ to linting ones, `sui-lint js --fix` is also executed.

### Lint SASS files

```
$ sui-lint sass [options]
```

Lints all `**/src/**/*.scss` files in the project, excluding `node_modules`, `lib`, `dist`.

> **`.gitignore` file patterns are also excluded but interpretation may differ as only glob patterns are understood**


### Scope commands to staged files

```sh
$ sui-lint js --staged
$ sui-lint sass --staged
$ sui-lint format-js --staged
```

Same command but applied only on staged files (obtained with `git diff --cached --name-only --diff-filter=d` command).

> **In write mode like with `sui-lint js --fix` or `sui-lint format-js`, the `--staged` option will stage the files again (`git add <file...>`)**

For integrations, prettier config is located in `@s-ui/lint/.prettierrc.js`.


## IDE integration:

Steps to integrate sui-lint with an IDE:

1.  Install (if needed) eslint/sassLint plugin in your IDE.
2.  Add these lines to `package.json`:

```json
{
  "eslintConfig": {
    "extends": ["@s-ui/lint/eslintrc.js"]
  },
  "sasslintConfig": "./node_modules/@s-ui/lint/sass-lint.yml"
}
```

## Example package.json

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
    "@s-ui/lint": "1.0.0-beta.1"
  },
  "eslintConfig": { "extends": ["./node_modules/@s-ui/lint/eslintrc.js"] },
  "sasslintConfig": "./node_modules/@s-ui/lint/sass-lint.yml"
}
```
