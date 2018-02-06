# SUI (Schibsted User Interface)

Monorepo of SUI packages.

SUI is a set of packages which goal to ease development of SUI-based components and web apps, providing:
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
| Name | Description |
| -- | -- |
| [babel-preset-sui](./packages/babel-preset-sui/README.md) | A babel preset for SUI components common syntax |
| [sui-lint](./packages/sui-lint/Readme.md) | CLI to lint your code and make it compliant to SUI official rules |
| [sui-precommit](./packages/sui-precommit/Readme.md) | Effortless SUI precommit rules integration in your project |
| [sui-component-dependencies](./packages/sui-component-dependencies/README.md) | A set of common dependencies for all SUI components |
| [sui-cz](./packages/sui-cz/README.md) | A commitizen adapter for semantic commits |
| [sui-mono](./packages/sui-mono/README.md) | Simple CLI for monorepo/multipackage commits, releases, etc. |
| [sui-studio](./packages/sui-studio/README.md) | Develop, maintain and publish your SUI components catalog. |
| [sui-studio-create](./packages/sui-studio-create/README.md) | CLI to create a new catalog of components |
| [sui-bundler](./packages/sui-bundler/README.md) | Config-free bundler for ES6 React apps |
| [sui-perf](./packages/sui-perf/Readme.md) | React performance graphs in terminal (SSR support) |
| [sui-widget-embedder](./packages/sui-widget-embedder/Readme.md) | Widget development server and build for production |
| [sui-i18n](./packages/sui-i18n/README.md) | Isomorphic i18n service for browser and node |
| [sui-polyfills](./packages/sui-polyfills/README.md) | Polyfills to load on our projects |
| [sui-js](./packages/sui-js/README.md) | Javascript utilities |
| [sui-ssr](./packages/sui-ssr/README.md) | Plug SSR to you SUI SPA (pending) |
| [sui-react-domain-connector](./packages/sui-react-domain-connector/README.md) | Connect any React component to your domain use cases | 
| [sui-hoc](./packages/sui-hoc/README.md) | React utility belt for function components and higher-order components |
| [sui-react-initial-props](./packages/sui-react-initial-props/README.md) | Initial data fetching for your react app |