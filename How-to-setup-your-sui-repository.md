> SUI packages must care about 2 things:
> * Code quality (linting and tests), checked on `pre-commit` git hook.
> * Commit messages format, checked on `commit-msg` git hook.
>
> [sui-mono] is a tool that helps managing this for monorepos (multiple packages). But it also can be used for single-package repos. That's why the following guidelines can be applied to both types of packages.


## 1. Install precommit rules
[sui-precommit] provides a CLI that executes for you SUI linting rules and your npm `test` script.

### 1.1 Install `sui-precommit`

```sh
$ npm install @schibstedspain/sui-precommit --save-dev --save-exact
```

### 1.2 Install `sui-precommit` scripts and hooks

```sh
$ sui-precommit install
```

> :warning: **Caution!**
>
>  **Make sure you first remove the pre-commit and pre-push hooks from the
`.git/hooks` directory. `sui-precommit install` will not overwrite them.**

Now your package.json to have the following changes

```js
{
  "scripts": {
    "lint": "sui-lint js && sui-lint sass",
    "precommit": "sui-precommit run"
  },
  "devDependencies": {
    "@schibstedspain/sui-precommit": "2",
    "husky": "0.13.4"
  }
}
```

Now, `sui-precommit run` will be executed prior every commit.

## 2. Install commit message formatting

[sui-mono] provides [commitizen](https://www.npmjs.com/package/commitizen) implementation to ensure commits follow the global "SUI's commit message format".


### 2.1 Install `sui-mono`

```sh
$ npm install @schibstedspain/sui-mono --save-dev --save-exact
```

### 2.2 Delegate your commits to `sui-mono`

Create a "co" script and now only use `npm run co` for your commits.

```js
// package.json
{
  "scripts": {
    "co": "sui-mono commit"
  },
  "devDependencies": {
    "@schibstedspain/sui-mono": "1"
  }
}
```

If your repo is a monorepo, sui-mono will add each package as a scope.

### 2.3 Add a `commit-msg` hook

For those commits who will directly use `git commit` command, we need to ensure they follow our format.

```sh
$ npm install validate-commit-msg --save-dev --save-exact
```

And configure commit-msg hook to sui-mono's commitizen types. Your package.json should have the following changes:

```js
// package.json
{
  "scripts": {
    "commitmsg": "validate-commit-msg"
  },
  "config": {
    "validate-commit-msg": {
      "types": "@schibstedspain/sui-mono/src/types"
    }
  },
  "devDependencies": {
    "validate-commit-msg": "2.12.2"
  }
}
```

[sui-mono]: https://www.npmjs.com/package/@schibstedspain/sui-mono
[sui-precommit]: https://www.npmjs.com/package/@schibstedspain/sui-precommit
