# SUI ![CI](https://github.com/SUI-Components/sui/workflows/CI/badge.svg)

SUI is a set of packages which goal to ease development of SUI-based components and web apps, providing:

* Unified stack (and workflow) easily updatable across all sui based projects.
* Minification of boilerplate. Boilerplate is tedious and copied code. Hardest to update...
* Different tools and services that solve only one problem each.
* Transparency for developer (changes and improvements have no impact on DX)
* Facilitates tooling development as assumptions can be made on the stack of each package.

## Available packages

| Name | Description |
| -- | -- |
| [babel-preset-sui](./packages/babel-preset-sui) | A babel preset for SUI components common syntax |
| [sui-bundler](./packages/sui-bundler) | Config-free bundler for ES6 React apps |
| [sui-ci](./packages/sui-ci) | CLI and library with tools for Continuos Integration |
| [sui-component-dependencies](./packages/sui-component-dependencies) | A set of common dependencies for all SUI components |
| [sui-consents](./packages/sui-consents) | User consents handler |
| [sui-critical-css](./packages/sui-critical-css) | Extract Critical CSS from an app |
| [sui-critical-css-middleware](./packages/sui-critical-css-middleware) | Express middleware to handle all regarding Critical CSS usage |
| [sui-dashboard](./packages/sui-dashboard) | Dashboard for SUI components |
| [sui-decorators](./packages/sui-decorators) | Set of ES6 decorators to improve your apps. |
| [sui-domain](./packages/sui-domain) | Backbone for creating a domain that complains with the guidelines of Adevinta Spain. |
| [sui-helpers](./packages/sui-helpers) | A set of internal helpers used by sui-related packages. |
| [sui-hoc](./packages/sui-hoc) | React utility belt for function components and higher-order components |
| [sui-i18n](./packages/sui-i18n) | Isomorphic i18n service for browser and node |
| [sui-jest](./packages/sui-jest) | CLI to work with Jest |
| [sui-js](./packages/sui-js) | Javascript utilities |
| [sui-js-compiler](./packages/sui-js-compiler) | Javascript compiler |
| [sui-lint](./packages/sui-lint) | CLI to lint your code and make it compliant to SUI official rules |
| [sui-mockmock](./packages/sui-mockmock) | Mocking utilities for testing. |
| [sui-mono](./packages/sui-mono) | Simple CLI for monorepo/multipackage commits, releases, etc. |
| [sui-pde](./packages/sui-pde) | An adapter based tool to handle feature toggles, progressive rollouts and A/B Testing services in our products |
| [sui-polyfills](./packages/sui-polyfills) | Polyfills to load on our projects |
| [sui-precommit](./packages/sui-precommit) | Effortless SUI precommit rules integration in your project |
| [sui-react-context](./packages/sui-react-context) | React context provider for SUI components |
| [sui-react-head](./packages/sui-react-head) | Populate the head element of your React app without hassle |
| [sui-react-initial-props](./packages/sui-react-initial-props) | Initial data fetching for your React app |
| [sui-react-router](./packages/sui-react-router) | Set of navigational components that compose declaratively with your application. |
| [sui-sass-loader](./packages/sui-sass-loader) | Sass loader for SUI |
| [sui-segment-wrapper](./packages/sui-segment-wrapper) | Abstraction layer on top of the Segment library. |
| [sui-ssr](./packages/sui-ssr) | Plug SSR to you SUI SPA |
| [sui-studio-create](./packages/sui-studio-create) | CLI to create a new catalog of components |
| [sui-studio-utils](./packages/sui-studio-utils) | A set of sui-studio usable tools. |
| [sui-studio](./packages/sui-studio) | Develop, maintain and publish your SUI components catalog. |
| [sui-svg](./packages/sui-svg) | Converts your SVG files into React Components |
| [sui-test](./packages/sui-test) | Zero config testing tool. |
| [sui-test-contract](./packages/sui-test-contract) | Useful tooling for executing contract tests |
| [sui-test-e2e](./packages/sui-test-e2e) | Zero config e2e testing tool. |
| [sui-theme](./packages/sui-theme) | Theme system for SUI |
| [sui-widget-embedder](./packages/sui-widget-embedder) | Widget development server and build for production |

## Available scripts

- `phoenix` - Clean and install all workspace packages and root dependencies.
- `co` - Do the commits with a prompt that enforces commit message format.
- `lint` - Checks the format of JS & SASS files
- `test` - Run components client and server tests
- `test:client:ci` - Run client tests for CI
- `test:server:ci` - Run server tests for CI
- `test:client` - Run client tests
- `test:client:watch` - Run client tests and watch for changes
- `test:server` - Run server tests
- `test:server:watch` - Run server tests and watch for changes
- `test:e2e` - Run E2E tests

## Project Stats

![Project Stats](https://repobeats.axiom.co/api/embed/0f3c2ce931553c4d7dc2338a83e4d8f7caf87160.svg "Repobeats analytics image")
