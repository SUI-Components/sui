# sui-cz
> A commitizen adapter for semantic commits.

It provides
* CLI commit prompt to guide developer on commit messages.
* Enforcement of semantic commits human-readable and machine- parsable.
* Parseable commits are used for releases by [sui-mono](../sui-mono)

It's highly inspired in `cz-customizable` adapter.

![](./assets/sui-cz-demo.gif)


## Installation/Usage


### Use sui-cz types with [validate-commit-msg](https://www.npmjs.com/package/validate-commit-msg)

```shell
npm install --save-dev validate-commit-msg
npm install --save-dev @s-ui/cz
```

in `package.json`

```js
{
  "config": {
    "validate-commit-msg": {
      "types": "@s-ui/cz/types"
      /* rest of your config here */
    }
  }
}
```

### Integrating validate-commit-msg with git "commit-msg" hook

We recommend using [husky](https://www.npmjs.com/package/husky).

```
npm install husky --save-dev
```


```shell
npm install --save-dev validate-commit-msg
npm install --save-dev @s-ui/cz
```

in `package.json`

```js
{
  "scripts": {
    /* ... your own scripts ... */
    "commitmsg": "validate-commit-msg"
  }
}
```
