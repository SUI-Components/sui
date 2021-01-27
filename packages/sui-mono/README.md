# sui-mono

> Simple CLI for monorepo/multipackage.

[`sui-mono`](https://github.com/SUI-Components/sui/tree/master/packages/sui-mono) is a tool that aims to **simplify management for monorepo/multipackage projects** ([`sui`](https://github.com/SUI-Components/sui/) for example) but _it also works with monopackage projects_.

`sui-mono` provides:

- Commit template → `sui-mono commit`
- Release manager (parses commits to publish packages according to their changes) → `sui-mono check`, `sui-mono release`
- Run commands inside each package → `sui-mono run npm install`, `sui-mono run-parallel npm install`

We use:

- [ComVer](https://github.com/staltz/comver) as our versioning system
- [Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153#commit-message-conventions) as our standard for commit messages

`sui-mono` provides, among other things, a standard template for commit messages (`sui-mono commit`) and is able to decide what needs to be released for you (`sui-mono check` & `sui-mono release`).

![](./assets/sui-mono-demo.gif)

<!-- TOC -->

- [sui-mono](#sui-mono)
  - [Installation](#installation)
  - [Usage](#usage)
    - [`run` command on all packages](#run-command-on-all-packages)
    - [`phoenix`](#phoenix)
    - [`commit`](#commit)
    - [`commit-all` commit for all contained packages](#commit-all-commit-for-all-contained-packages)
    - [`check` & `release`](#check--release)
  - [How to configure your project](#how-to-configure-your-project)
    - [`private`](#private)
    - [`access`](#access)
    - [Scope (`packagesFolder`, `deepLevel`, `customScopes`)](#scope-packagesfolder-deeplevel-customscopes)
      - [Examples](#examples)
        - [Project Example](#project-example)
        - [Case `sui-studio`](#case-sui-studio)
      - [Manual scopes](#manual-scopes)

<!-- /TOC -->

## Installation

```bash
$ npm install @s-ui/mono --save-dev
```

## Usage

### `run` command on all packages

You can run a single command on each package of the monorepo (each subfolder with its own `package.json`), **in series**

```sh
$ sui-mono run <command>
$ sui-mono run npx rimraf node_modules
$ sui-mono run npm install
```

You can also run them **in parallel**

```sh
$ sui-mono run-parallel <command>
$ sui-mono run-parallel npx rimraf node_modules
$ sui-mono run-parallel npm install
```

### `phoenix`

To reset your project and all its contained packages.

```sh
sui-mono phoenix
```

Equivalent to `npx rimraf node_modules && npm i` but it works on any environment and `sui-mono phoenix` executes it concurrently on each package (and/or on your project root folder).

By default commands will be executed on chunks of 20 packages, but you can change it with `-c, --chunk` option:

```sh
sui-mono phoenix -c 5
```

So, if executing many commands as the same time in your machine is too heavy, you can adjust it.
You can also disable the chunks with 0 value and always execute all commands in parallel:

```sh
sui-mono phoenix -c 0
```

If you don't want a fancy progress output (for instance in CI env), you can force a plain text output:

```sh
sui-mono phoenix --no-progress
```

Reinstalls all scope packages but ignores the `node_modules` folder and `package-lock.json` file at the root level of your project

```sh
sui-mono phoenix --no-root
```

Ables you to just reinstall the dependencies from a single scope

```sh
sui-mono phoenix --no-root --scope atom/button
```

### `commit`

You do your normal git workflow, but when commiting you should use:

```sh
sui-mono commit
```

It will prompt you with questions regarding your changes and will generate a standard commit message for you

### `commit-all` commit for all contained packages

You can commit the same message for all packages that actually contained stageable
files.

```sh
sui-mono commit-all -t "feat" -m "Refactor of dependencies"
```

The precommit will be executed only for the first commit.

### `check` & `release`

In order to release the steps are:

Preview what will be released

```sh
sui-mono check
```

Release all the packages

```sh
sui-mono release
```

In case you want to release a **single package** use the `--scope` param

```sh
sui-mono release --scope "packages/sui-test"
```

> Your packages must implement script `npm run build` or `npm run prepublish` that will be executed before any release.

> 👉 `sui-mono` creates a new `MINOR` version for the package only when `fix`, `perf` or `feat` commits are detected, and a new `MAJOR` version if there is some commit marked as `BREAKING CHANGES`. Otherwise (any other types of commits detected), no new version will be generated and nothing will be released

Automatic release (only CI)

In case you want to release via CI the `--github-user` `--github-email` and `--github-token` must be passed by like follows:

```sh
sui-mono release --github-user [username] --github-email [user email] --github-token [TOKEN]
```

## How to configure your project

First you need to install the `@s-ui/mono` package in your project

```sh
npm i --save-dev @s-ui/mono
```

Then, you can configure your `package.json` to suit your needs

`sui-mono` allows you to configure some parts of its functioning, but it also defines a few defaults for convenience.

Here's a full example of the options

```json
"private": true,
"config": {
  "sui-mono": {
    "access": "public",
    "packagesFolder": "test/components",
    "deepLevel": 2,
    "customScopes": [
      "cz-config",
      "check",
      "release"
    ]
  },
  "validate-commit-msg": {
    "types": "@s-ui/mono/src/types"
  },
}
```

### `private`

If you specify that your package is private (`"private": true,`), it will not get pushed to npm repository

### `access`

By default packages will be published as `restricted` in npm. If you want them to be public you will need to set `"access": "public"`

### Scope (`packagesFolder`, `deepLevel`, `customScopes`)

> 👉 Setting the proper scope in the commit message is important, because this is used for `sui-mono check` and `sui-mono release` to assign changes to specific packages and release them to the proper packages

We provide a simple tool to automate the way the [scopes](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#commit-message-with-scope) are retrieved.
If you follow a structure where do you have:

- a main folder and
- inside this folder you have all the packages (subfolders, each one of them with its own `package.json` → _scopes_)

...this configuration will work for you

In order to specify the main folder you need to provide `packagesFolder` by default its value is `src`
By default we check only 1 level inside the main folder, but if you have categories for each package and inside the packages you can configure `deepLevel`

This information will be used for releases and [`commitizen`](https://commitizen.github.io/cz-cli/) scopes.

#### Examples

###### Project Example

So, if you have a project like this:

```text
src/
  i18n/
  users/
  search/
  ...
```

The default options will give you a list of scopes like this one for your commit:

```text
i18n
users
search
```

###### Case `sui-studio`

In the case of [`sui-studio`](https://github.com/SUI-Components/sui/tree/master/packages/sui-studio), which generates a folder like this one:

```text
components/
 ads/
  big/
  small/
 card/
  featured/
  normal/
```

If you set the configuration of your project like this:

```json
"packagesFolder": "components"
"deepLevel": 2
```

You will have a list of scopes like this one when performing a commit:

```text
ads/big
ads/small
card/featured
card/normal
```

#### Manual scopes

There may be cases that you may want to add scopes for informative purposes but not related in any way with the releases

Take in care that this scopes **will not be relevant for the release**, and if you commit to one package that has his own scope, but you use a custom scope, a release will not be generated.
Custom scopes are for a very rare cases and you may not need it most of the times.

Use `customScopes` in this cases like in the example. The scopes will be added to the automatically generated ones.
