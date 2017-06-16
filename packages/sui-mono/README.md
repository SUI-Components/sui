# sui-mono

A tool in charge of... releases and.. commits...

It will help you release a mono-repo multi-package project.
We use ComVer as our versioning system

It uses comitizen to provide a standard template of commit messages.
It also provides two tools for checking if any release is required or to perform a release.

## How to use it

### Commit

You do your normal git workflow, but when commiting you should use:

```
sui-mono commit
```

### Release

In order to release the steps normally are:

```
sui-mono check

sui-mono release
```

The first one will provide information if anything requires a release.
The second one will release the packages

> Your packages must implement script `npm run build` that will be executed before any release.

## How to configure your project

First you need to install the @sui/mono package in your  project

```
npm i --save-dev @sui/mono
```

Then, configure your package.json

### Tool configuration

The tool allows you to configure some parts of it, but it also defines a few defaults for convenience.

Here's a full example of the options

```
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
    "types": "@schibstedspain/sui-mono/src/types"
  },
}
```

### Access

By default packages will be published as private in npm. If you want them to be public you will need to set `access` to `public`

### Automatic scopes

We provide a simple tool to automate the way the scopes are retrieved.
If you follow a structure where do you have a main folder and inside this folder you have all the packages (scopes) this configuration will work for you

In order to specify the main folder you need to provide `packagesFolder` by default its value is `src`
By default we check only 1 level inside the main folder, but if you have categories for each package and inside the packages you can configure `deepLevel`


This information will be used for releases and commitizen scopes. If you have a project like this:

```
src/
  i18n/
  users/
  search/
  ...
```

The default options will give you a list of scopes like this one for your commit:

```
i18n
users
search
```

In the case of suistudio, that generates a folder like this one:

```
components/
 ads/
  big/
  small/
 card/
  featured/
  normal/
```

If you set the configuration of your project like this:
```
"packagesFolder": "components"
"deepLevel": 2
```

You will have a list of scopes like this one when performing a commit:

```
ads/big
ads/small
card/featured
card/normal
```

### Manual scopes

There may be cases that you may want to add scopes for informative purposes but not related in any way with the releases (for example, this project does not have a way to retrieve automatic scopes)

Take in care that this scopes **will not be relevant for the release**, and if you commit to one package that has his own scope, but you use a custom scope, a release will not be generated.
Custom scopes are for a very rare cases and you may not need it most of the times.

Use `customScopes` in this cases like in the example. The scopes will be added to the automatic ones.
