# sui-changelog

> CLI to retrieve a changelog from a set of dependencies.

## Description

The main aim of this package is to build a changelog file with all the last changes you get in your last installation within your project. Dependencies are retrieved by its scope in the `node_modules` folder, so you can customize the scopes to get the changelog data from.

## Usage

Install `node@11` with `npm@6` in your env and run the following CLI command:

```sh
$ npx @s-ui/changelog
```

Or, if you already have it installed:

```sh
$ sui-changelog
```

### Adding more scopes

By default, `sui-changelog` works only with `@s-ui` scoped packages, so if you want to add more scopes to your changelog, just add them in your project `package.json` file, the same way as the example below:

```js
{
  "sui-changelog": {
    "scopes": ["@my-awesome-scope", "@another-scope"]
  }
}
```

### Retrieving data from private repositories

If you know you have some private respositories inside your set of dependencies, you should add a GitHub access token in order to make it work. Such token has to be added like the following example:

```js
{
  "sui-changelog": {
    "githubToken": "MY_AWESOME_GITHUB_PERSONAL_ACCESS_TOKEN"
  }
}
```

You can get more information in this link to get the token: https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line. If it's not provided, the changelog data for such package will be ignored.

## Output

After triggering the CLI command `sui-changelog` we'll get new changes in our project. Firstly, current package version (`package.json` file) will be updated. Then, if it's the first time a new file named `CHANGELOG.md` will be added to your project, but if you already got it, a new hunk of changes will be added at the top of your file.

```cs
├── node_modules
    ├── @my-awesome-scope
    │   └── my-awesome-package // Package last changes will be retrieved from.
    ├── @another-scope
    │   └── another-scope-package // Other package last changes will be retrieved from.
    ├── eslint
    └── react
├── package.json // Modified with the new package version.
└── CHANGELOG.md // New or modified with the last changes.
```
