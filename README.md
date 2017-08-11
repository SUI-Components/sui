# SUI (Schibsted User Interface)

Monorepo of SUI packages.

SUI is a set of packages which goal to ease development of sui based components and web packs, providing:
* Unified stack (and workflow) easily updateable accross all sui based projects.
* Minification of boilerplate. Boilerplate is tedious and copied code. Hardest to update...
* Differents tools and services that solve only one problem each.
* Transparency for developer (changes and improvements have no impact on DX)
* Facilitates tooling development as asumptions can be made on the stack of each package.

## Requirements

### Add `./node_modules/.bin/` to your $PATH
Many SUI packages provide a CLI as a service. The binaries are declared in the package.json `bin` key.

To make all npm binaries available in your command line, you should add bin directory to your $PATH:

```sh
$ export PATH="$PATH:./node_modules/.bin"
```

## Available packages
| Name | Description | Status |
| -- | -- | -- |
| [babel-preset-sui](./packages/babel-preset-sui/README.md) | Develop, maintain and publish your SUI components | :white_check_mark: |
| [sui-lint](./packages/sui-lint/Readme.md) | CLI to lint your code and make it compliant | :white_check_mark: |
| [sui-precommit](./packages/sui-precommit/Readme.md) | Effortless SUI precommit rules integration in your project | :white_check_mark: |
| [sui-component-dependencies](./packages/sui-component-dependencies/README.md) | A set of dependencies of all SUI components | :white_check_mark: |
| [sui-cz](./packages/sui-cz/README.md) | A commitizen adapter for semantic commits | :white_check_mark: |
| [sui-mono](./packages/sui-mono/README.md) | Simple CLI for monorepo/multipackage | :white_check_mark: |
| [sui-studio](./packages/sui-studio/README.md) | Develop, maintain and publish your SUI components | :white_check_mark: |
| [sui-hoc](./packages/sui-hoc/README.md) | React utility belt for function components and higher-order components | :white_check_mark: |
| [sui-bundler](./packages/sui-bundler/README.md) | Config-free bundler for ES6 React apps | :white_check_mark: |
| [sui-i18n](./packages/sui-i18n/README.md) | Isomorphic i18n service for browser and node | :hourglass: |
| [sui-react-domain-connector](./packages/sui-react-domain-connector/README.md) | Connect any React component to your domain use cases | :hourglass: |
| [sui-ssr](./packages/sui-ssr/README.md) | Plug SSR to you SUI SPA | :hourglass: |
| [sui-decorators](./packages/sui-decorators/README.md) | Develop, maintain and publish your SUI components | :hourglass: |
| [sui-polyfills](./packages/sui-polyfills/README.md) | Polyfills to load on our projects | :hourglass: |
