# sui-precommit
> Effortless SUI precommit rules integration in your project


Installs commit hook to ensure quality rules are executed before any commit (test, linting, consistent commit, etc)

It provides:
* Assurance that all code is compliant with Schibsted's standards.
* Centralize precommit rule:;  quality rules can be  improved and seemlessly inherited by all projects.


## Installation


```sh
$ npm install @schibstedspain/sui-precommit --save-dev
```

## CLI


### `$ sui-precommit run`


Executes all rules:
* `sui-lint` for both js and sass
* Your own `test` command from package.json
and your own "test" command.



### `$ sui-precommit install`

Installs `sui-precommit` as git pre-commit hook.

Executes 3 actions:
1. Install [husky](https://www.npmjs.com/package/husky) (if not installed yet) to your project.
1. Add `sui-precommit run` as husky's precommit script.
1. Add `sui-lint` as npm lint script  command so you can execute linting separately.

Your package.json might be altered like that:

```json
{
  "scripts": {
    "lint": "sui-lint js && sui-lint sass",
    "precommit": "sui-precommit run"
  },
  "devDependencies": {
    "husky": "^0.13.4",
  }
}

```
