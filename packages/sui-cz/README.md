# sui-cz

This is a commitizen adapter for the sui-mono tool and any other packages of sui family

Is highly inspired in `cz-customizable` adapter. In fact, we would be still using it if commitizen allowed to send configuration in the boostrap.

## Use sui-cz types with [validate-commit-msg](https://www.npmjs.com/package/validate-commit-msg)

```shell
npm install --save-dev validate-commit-msg
npm install --save-dev @schibstedspain/sui-cz
```

in `package.json`

```js
{
  "config": {
    "validate-commit-msg": {
      "types": "@schibstedspain/sui-cz/types"
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
npm install --save-dev @schibstedspain/sui-cz
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
