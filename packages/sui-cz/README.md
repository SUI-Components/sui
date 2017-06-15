# sui-cz

This is a commitizen adapter for the sui-mono tool and any other packages of sui family

This is required to be in a different repo by cz, and the package does not use our `@schibsted` prefix because of how commitizen bootstrap resolves routes.

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
