# Contributing to SUI

The following is a set of guidelines for contributing to SUI's packages.

## What should I know before I get started?

### Environment

To develop new packages, you only need to install `node` and `npm`. Find below the default versions this repo was built with:
* node: `18`
* npm: `8`

### Monorepo

This repo is a monorepo: a single git repo that manages several NPM packages.

Packages are located in the `./packages` directory and managed by `sui-mono` CLI.

### Package Conventions

#### Naming

Packages must be properly named. 3 name are
* Name of the folder in `./packages`
* Name of package at NPM

2 simple rules:
* `sui` prefix for all packages
* `@s-ui` scope for publish

**Example for package `my-example-package`**
* Folder: `./packages/sui-my-example-package`
* NPM name: `@s-ui/my-example-package`

### Versionning

We follow the [comver](https://github.com/staltz/comver) versionning this system (X.y.0).

Packages first version must be `1.0.0` (not 0.0.0)

### Mandatory fields in package.json

Some fields are mandatory in every `package.json`:
* `repository`: Must be included and point to monorepo.
* `homepage`: Must be included and point to monorepo sub package readme.
* `license`: MIT license

**Example for package `my-example-package`**

```js
/* ./packages/sui-my-example-package/package.json */

{
  /* ... */
  "name": "@s-ui/my-example-package",
  "version": "1.0.0",
  /* ... */
  "repository": {
    "type": "git",
    "url": "git+https://github.com/SUI-Components/sui.git"
  },
  "homepage": "https://github.com/SUI-Components/sui/tree/master/packages/my-example-package#readme",
  "license": "MIT"
  /* ... */
}
```

## How Can I Contribute?

### Reporting A Bug

Bugs are tracked as [GitHub issues](https://github.com/SUI-Components/sui/issues/). An [issue template](.github/ISSUE_TEMPLATE.md) is already configured to guide you.

**Please add name of the package into brackets in the title**.

Example: "[sui-mono] Add run-all command"

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/).
Same [issue template](.github/ISSUE_TEMPLATE.md) is used. Adapt it if necessary.


## Additional Notes

### How to migrate an existing repo to this monorepo ?

#### First commit: copy paste
The first commit of the package should be a plain copy of the original package.

This way, you guarantee that the original owner can review the changes you've made for the migration.


#### Deprecate origin package


##### 1. Deprecate at registry

Use [npm deprecate](https://docs.npmjs.com/cli/deprecate) to warn developers that the component was migrated when they install it.

```
npm deprecate @scope/origin-package "@scope/origin-package is deprecated. Use @s-ui/my-example-package instead."
```

##### 2. Update README with deprecation warning

Add this (modified) snippet on top of your package README.md file.
```markdown
![deprecated](https://img.shields.io/badge/stability-deprecated-red.svg) THIS PACKAGE IS **DEPRECATED!**

**Use [@s-ui/my-example-package](https://www.npmjs.com/package/@s-ui/my-example-package) instead.**

```


##### 3. Publish it as patch version

Publish the README change as patch. This way, developers that point to a minor or major version will be informed of the deprecation.

```
npm version patch
npm publish
```
