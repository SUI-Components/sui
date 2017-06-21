# sui-precommit
> Effortless SUI precommit rules integration in your project

Installs commit hook to ensure quality rules are executed before any commit (test, linting, consistent commit, etc)
It provides:
* Assurance that all code is compliant with schibsted's standards
* Centralize precommit rules;  quality rules can be  improved and seemlessly inherited by all projects.


## Installation


```sh
$ npm install @schibstedspain/sui-precommit --save-dev
```


## Usage

Once installed, 3 new tasks are added to your project:

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "scripts": {
    "lint:js": "sui-lint js",
    "lint:sass": "sui-lint sass",
    "lint": "npm run lint:js && npm run lint:sass"
  },
  "pre-commit": [
    "lint",
    "test"
  ],
  "devDependencies": {
    "@schibstedspain/sui-precommit": "1"
  }
}
```
