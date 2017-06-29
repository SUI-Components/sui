> Th¡s document will guide you to migrate your studio to version 4.
>
> `sui-studio@4` works now **locally**, not globally. So its migration requires
> multiple changes.


## 1. Add sui-studio as local dep
The only "global command" `suistudio init` was migrated to [sui-studio-create].

### 1.1 Install sui-studio
```sh
$ npm install @schibstedspain/sui-studio@4 --save-exact --save-dev
```

### 1.2 Add sui-mono config
Now sui-studio is a wrapper of [sui-mono] (a monorepo CLI), that adds component-specific features
like generators and playgrounds.

```js
// package.json
{
  "config": {
    "sui-mono": {
      "packagesFolder": "components",
      "deepLevel": 2
    }
  }
}
```

## 2. Migrate CLI calls to sui-studio
For consistency purpose, `suistudio` binary has been renamed to `sui-studio`. Same for package.json config key.

before:
```js
// package.json
{
  "scripts": {
    "phoenix": "rm -Rf node_modules && npm i && sui-studio clean-modules && sui-studio run-all npm i",
    "start": "NODE_ENV=development sui-studio start"
  }
}
```

after:
```js
// package.json
{
  "scripts": {
    "phoenix": "rm -Rf node_modules && npm i && suistudio clean-modules && suistudio run-all npm i",
    "start": "NODE_ENV=development suistudio start"
  },
  "config": {
    "sui-studio": {
      "name": "My Components"
    }
  }
}
```

## 3. Migrate linting to sui-precommit rules

[suistudio-fatigue-deps] was providing linting CLI throught [linting-rules].

Now linting is reponsibility of [sui-lint] (through [sui-precommit]).

### 3.1 Install sui-precommit

```sh
$ npm install @schibstedspain/sui-precommit@2 --save-dev --save-exact
```

### 3.2 Install precommit hooks (linting)

```sh
$ sui-precommit install
```

> :warning: **Caution!**
>
>  **Make sure you first remove the pre-commit and pre-push hooks from the
`.git/hooks` directory. `sui-precommit install` will not overwrite them.**


## 4. Migrate commit message CLI to sui-cz

[suistudio-fatigue-deps] was including commitizen (git-cz) as a dependency.

Now sui-studio@4 provides the same (through [sui-mono]). Nevertheless configuration is slightly different.

### 4.1 Delegate commits to sui-studio

```js
// package.json
{
  "scripts": {
    "co": "sui-studio commit"
  }
}
```

### 4.2 Hook commit messages with husky

```sh
$ npm install validate-commit-msg --save-dev
```

And configure commit-msg hook to sui-mono cz-types.

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

## 5. Clear your components

### 5.1 Remove unused npm scripts

  With `sui-studio@4`, your components don't need anymore:
  * `preversion` npm script, as sui-mono takes care of releases.
  * `version` npm script, as sui-mono executes `build` before each release.
  * `postversion` npm script, as sui-mono takes care of tags and publishing.

### 5.2 Replace preset for each components

babel-preset-schibsted-spain preset was deprecated in favor of babel-preset-sui

before:
```js
// package.json
{
  "scripts": {
    "babel": "../../../node_modules/.bin/babel --presets schibsted-spain ./src --out-dir ./lib"
  }
}
```

after:
```js
// package.json
{
  "scripts": {
    "babel": "../../../node_modules/.bin/babel --presets sui ./src --out-dir ./lib"
  }
}
```

### 5.3 Replace suistudio-fatigue-deps by [sui-component-dependencies]

[suistudio-fatigue-deps] was deprecated in favor of
[sui-component-dependencies].

You need to replace one dep by the new one:
```sh
$ sui-studio run-all npm uninstall @schibstedspain/suistudio-fatigue-deps --save
$ npm install @schibstedspain/sui-component-dependencies@latest --save
```

> :warning: **Caution!**
>
>  **Make sure latest tag is save for the dependency**

```js
{
  "dependencies": {
    "@schibstedspain/sui-component-dependencies": "latest"
  }
}
```


[sui-studio-create]: https://www.npmjs.com/package/@schibstedspain/sui-studio-create
[sui-component-peer-dependencies]: https://www.npmjs.com/package/@schibstedspain/sui-component-peer-dependencies
[sui-mono]: https://www.npmjs.com/package/@schibstedspain/sui-mono
[suistudio-fatigue-deps]: https://www.npmjs.com/package/@schibstedspain/suistudio-fatigue-deps
[linting-rules]: https://www.npmjs.com/package/@schibstedspain/linting-rules
[sui-precommit]: https://www.npmjs.com/package/@schibstedspain/sui-precommit
[sui-lint]: https://www.npmjs.com/package/@schibstedspain/sui-lint
[sui-component-dependencies]: https://www.npmjs.com/package/@schibstedspain/sui-component-dependencies
