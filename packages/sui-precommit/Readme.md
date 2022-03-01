# sui-precommit

> Effortless SUI precommit rules integration in your project

Installs git hooks to ensure quality rules are executed before any commit (test, linting, consistent commit, etc).

It provides:

* Assurance that all code is compliant with Adevinta's standards.
* Centralize precommit rule: quality rules can be improved and seemlessly inherited by all projects.

## Installation

```sh
$ npm install @s-ui/precommit --save-dev
```

## CLI

### `$ sui-precommit`

Installs git hooks. This command is executed automatically when you install `@s-ui/precommit` as dependency thanks to a `postinstall` npm hook.

Executes **3** actions:

1. Add `commit-msg`, `pre-commit`, and `pre-push` hooks to the `.git/hooks` folder.
2. Add `pre-commit` and `pre-push` npm scripts to the `package.json`.
3. Add `lint` and `test` npm scripts in case they're not present.
**Note:** *If scripts are already present, it doesn't overwrite them (as some packages might not need executing `sui-lint sass` or `sui-lint js` or you could have a specific config).*

Your package.json might be altered like that:

```json
{
  "scripts": {
    "lint": "sui-lint js && sui-lint sass",
    "test": "echo \"Error: no test specified\" && exit 1",
    "pre-commit": "npm run lint",
    "pre-push": "npm run test"
  }
}
```
