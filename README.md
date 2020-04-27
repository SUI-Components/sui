# SUI

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
| [babel-preset-sui](./packages/babel-preset-sui) | A babel preset for SUI components common syntax |
| [sui-bundler](./packages/sui-bundler) | Config-free bundler for ES6 React apps |
| [sui-changelog](./packages/sui-changelog) | CLI to retrieve a changelog from a set of dependencies |
| [sui-component-dependencies](./packages/sui-component-dependencies) | A set of common dependencies for all SUI components |
| [sui-component-peer-dependencies](./packages/sui-component-peer-dependencies) | A set of peer dependencies for all SUI components. |
| [sui-cz](./packages/sui-cz) | A commitizen adapter for semantic commits |
| [sui-decorators](./packages/sui-decorators) | Set of ES6 decorators to improve your apps. |
| [sui-domain](./packages/sui-domain) | Backbone for creating a domain that complains with the guidelines of Schibsted Spain. |
| [sui-helpers](./packages/sui-helpers) | A set of internal helpers used by sui-related packages. |
| [sui-hoc](./packages/sui-hoc) | React utility belt for function components and higher-order components |
| [sui-i18n](./packages/sui-i18n) | Isomorphic i18n service for browser and node |
| [sui-js](./packages/sui-js) | Javascript utilities |
| [sui-lint](./packages/sui-lint) | CLI to lint your code and make it compliant to SUI official rules |
| [sui-mockmock](./packages/sui-mockmock) | Mocking utilities for testing. |
| [sui-mono](./packages/sui-mono) | Simple CLI for monorepo/multipackage commits, releases, etc. |
| [sui-perf](./packages/sui-perf) | React performance graphs in terminal (SSR support) |
| [sui-polyfills](./packages/sui-polyfills) | Polyfills to load on our projects |
| [sui-precommit](./packages/sui-precommit) | Effortless SUI precommit rules integration in your project |
| [sui-react-domain-connector](./packages/sui-react-domain-connector) | Connect any React component to your domain use cases |
| [sui-react-head](./packages/sui-react-head) | Populate the head element of your React app without hassle |
| [sui-react-initial-props](./packages/sui-react-initial-props) | Initial data fetching for your react app |
| [sui-ssr](./packages/sui-ssr) | Plug SSR to you SUI SPA |
| [sui-studio-create](./packages/sui-studio-create) | CLI to create a new catalog of components |
| [sui-studio-utils](./packages/sui-studio-utils) | A set of sui-studio usable tools. |
| [sui-studio](./packages/sui-studio) | Develop, maintain and publish your SUI components catalog. |
| [sui-svg](./packages/sui-svg) | Converts your SVG files into React Components |
| [sui-test](./packages/sui-test) | Zero config testing tool. |
| [sui-widget-embedder](./packages/sui-widget-embedder) | Widget development server and build for production |
