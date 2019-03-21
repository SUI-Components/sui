# Change Log

All notable changes to this project will be documented in this file.

<a name="5.3.0"></a>
# 5.3.0 (2019-03-20)


### Bug Fixes

* fix linking packages not working with the react context package ([e908d4e](https://github.com/SUI-Components/sui/commit/e908d4e))



<a name="5.2.0"></a>
# 5.2.0 (2019-03-18)


### Features

* Move to babel-preset-sui@3 ([ac080bf](https://github.com/SUI-Components/sui/commit/ac080bf))



<a name="5.1.0"></a>
# 5.1.0 (2019-03-18)


### Bug Fixes

* force release of new package and tags ([bd0a45b](https://github.com/SUI-Components/sui/commit/bd0a45b))



<a name="5.0.0"></a>
# 5.0.0 (2019-03-18)


### Features

* bump major ([4cd98df](https://github.com/SUI-Components/sui/commit/4cd98df))
* remove react-hot-loader ([a742871](https://github.com/SUI-Components/sui/commit/a742871))


### BREAKING CHANGES

* Remove @hot/loader package



<a name="4.9.0"></a>
# 4.9.0 (2019-02-28)


### Bug Fixes

* add alias to get linked packages with react hooks working ([1f7ace4](https://github.com/SUI-Components/sui/commit/1f7ace4))



<a name="4.8.0"></a>
# 4.8.0 (2019-02-21)


### Features

* patch in development mode react-dom for get working with hooks and other features ([cf25e42](https://github.com/SUI-Components/sui/commit/cf25e42))



<a name="4.7.0"></a>
# 4.7.0 (2019-02-11)


### Bug Fixes

* set fixed react-dev-utils version ([f18c6cd](https://github.com/SUI-Components/sui/commit/f18c6cd))



<a name="4.6.0"></a>
# 4.6.0 (2019-02-04)


### Bug Fixes

* force terser version to avoid problems with webpack ([6c3351b](https://github.com/SUI-Components/sui/commit/6c3351b))



<a name="4.3.0"></a>
# 4.3.0 (2019-01-31)


### Bug Fixes

* alias react-hot-loader to avoid problems when linking a package ([102e28f](https://github.com/SUI-Components/sui/commit/102e28f))
* copy dev server url only in first compile ([08a1981](https://github.com/SUI-Components/sui/commit/08a1981))
* fix javascript link loader becasue wrong regex, add bunch of comments and prepare ([751842d](https://github.com/SUI-Components/sui/commit/751842d))
* fix linking subdependencies, better separation and useful logging ([ec4981c](https://github.com/SUI-Components/sui/commit/ec4981c))
* fix problems with capitalcase ([0dce3ba](https://github.com/SUI-Components/sui/commit/0dce3ba))


### Features

* separate sassLinkLoader ([06abb73](https://github.com/SUI-Components/sui/commit/06abb73))



<a name="4.2.0"></a>
# 4.2.0 (2019-01-25)


### Bug Fixes

* Fix react-hot-loader on linked packages ([1aaf396](https://github.com/SUI-Components/sui/commit/1aaf396))



<a name="4.1.0"></a>
# 4.1.0 (2019-01-15)


### Features

* add sourcemaps section to README documentation ([f497cd5](https://github.com/SUI-Components/sui/commit/f497cd5))
* add sourcemaps support to improve integration with sentry ([2ee87ff](https://github.com/SUI-Components/sui/commit/2ee87ff))
* remove unnecessary comment from uglifyjs config ([61aea8c](https://github.com/SUI-Components/sui/commit/61aea8c))



<a name="5.0.0"></a>
# 5.0.0 (2019-01-14)


### Bug Fixes

* add missing babel-cli ([24b7307](https://github.com/SUI-Components/sui/commit/24b7307))


### Features

* use new babel-preset-sui ([97ee9b3](https://github.com/SUI-Components/sui/commit/97ee9b3))


### BREAKING CHANGES

* Load new babel-preset-sui, stop using old babel-runtime and use @babel/runtime



<a name="3.34.0"></a>
# 3.34.0 (2019-01-07)


### Bug Fixes

* fix security issues with compromised dependencies ([46e450f](https://github.com/SUI-Components/sui/commit/46e450f))
* remove default value not needed ([e3b9cf0](https://github.com/SUI-Components/sui/commit/e3b9cf0))


### Features

* add react-hot-loader for dev webpack usage with babel preset sui ([a226993](https://github.com/SUI-Components/sui/commit/a226993))
* add react-hot-loader/babel for webpack dev ([385d9ca](https://github.com/SUI-Components/sui/commit/385d9ca))
* back to simple object instead function ([f88e3d2](https://github.com/SUI-Components/sui/commit/f88e3d2))
* bump to MAJOR version to publish beta ([4d43fff](https://github.com/SUI-Components/sui/commit/4d43fff))
* new beta ([2aafa25](https://github.com/SUI-Components/sui/commit/2aafa25))
* upgrade dependencies ([5e5976e](https://github.com/SUI-Components/sui/commit/5e5976e))


### BREAKING CHANGES

* Uses new babel-preset-sui major version and need to use latest babel/core version not compatible
with the old one



<a name="3.32.0"></a>
# 3.32.0 (2018-12-11)



<a name="3.31.0"></a>
# 3.31.0 (2018-12-11)


### Bug Fixes

* fix Windows RegExp syntax in LoaderConfigBuilder ([e626c3c](https://github.com/SUI-Components/sui/commit/e626c3c))
* new release with fix for npm-run-all ([8431bca](https://github.com/SUI-Components/sui/commit/8431bca))



<a name="3.30.0"></a>
# 3.30.0 (2018-12-11)


### Bug Fixes

* fix windows bug with Regex rules ([d1dffa7](https://github.com/SUI-Components/sui/commit/d1dffa7))



<a name="3.29.0"></a>
# 3.29.0 (2018-12-04)


### Bug Fixes

* ignore scss import files in server ([e41163e](https://github.com/SUI-Components/sui/commit/e41163e))


### Features

* add server support for dynamic import and keep chunkNames for client ([6698cd1](https://github.com/SUI-Components/sui/commit/6698cd1))



<a name="3.28.0"></a>
# 3.28.0 (2018-11-08)


### Bug Fixes

* fix resolves to better linking and be sure we use own versions ([d21e581](https://github.com/SUI-Components/sui/commit/d21e581))


### Features

* add option to make no pre loaders run ([d0d240b](https://github.com/SUI-Components/sui/commit/d0d240b))
* show port when compilation is not broken, only a warning ([5be259d](https://github.com/SUI-Components/sui/commit/5be259d))
* upgrade dependencies ([823cc94](https://github.com/SUI-Components/sui/commit/823cc94))



<a name="3.27.0"></a>
# 3.27.0 (2018-10-25)



<a name="3.26.0"></a>
# 3.26.0 (2018-10-24)


### Bug Fixes

* fix jsonp function param in webpack lib config ([28b3749](https://github.com/SUI-Components/sui/commit/28b3749))


### Features

* add resolve.alias to be passed as config param ([9ac79ba](https://github.com/SUI-Components/sui/commit/9ac79ba))
* update to new options from babel-loader ([6a152d8](https://github.com/SUI-Components/sui/commit/6a152d8))
* upgrade dependencies from babel7 ([8f85757](https://github.com/SUI-Components/sui/commit/8f85757))



<a name="3.25.0"></a>
# 3.25.0 (2018-10-15)


### Features

* update bundle analyzer to latest version ([9604fcd](https://github.com/SUI-Components/sui/commit/9604fcd))



<a name="3.24.0"></a>
# 3.24.0 (2018-10-09)


### Bug Fixes

* avoid collision of multiple webpack runtimes ([d6f627c](https://github.com/SUI-Components/sui/commit/d6f627c))
* avoid collision of multiple webpack runtimes ([6e65145](https://github.com/SUI-Components/sui/commit/6e65145))



<a name="3.23.0"></a>
# 3.23.0 (2018-10-02)


### Bug Fixes

* let our bundler notice us about our bundle environment ([8f92953](https://github.com/SUI-Components/sui/commit/8f92953))



<a name="3.22.0"></a>
# 3.22.0 (2018-09-26)


### Bug Fixes

* add optimization node env overwrite to false in order to avoid side effects on ser ([888d34d](https://github.com/SUI-Components/sui/commit/888d34d))



<a name="3.21.0"></a>
# 3.21.0 (2018-09-20)


### Bug Fixes

* fix webpack mode when compile a server ([e2bec1c](https://github.com/SUI-Components/sui/commit/e2bec1c))


### Features

* use new babel-loader with Babel@7 ([4b42854](https://github.com/SUI-Components/sui/commit/4b42854))



<a name="3.20.0"></a>
# 3.20.0 (2018-08-20)



<a name="3.19.0"></a>
# 3.19.0 (2018-08-16)


### Bug Fixes

* adjust public path on root=true ([0698bc5](https://github.com/SUI-Components/sui/commit/0698bc5))
* warn when library path is not provided ([c94490e](https://github.com/SUI-Components/sui/commit/c94490e))


### Features

* adds relative to absolute path conversion ([64785a2](https://github.com/SUI-Components/sui/commit/64785a2))
* sui-bundler lib --umd option ([6e76e57](https://github.com/SUI-Components/sui/commit/6e76e57))



<a name="3.18.0"></a>
# 3.18.0 (2018-08-10)


### Bug Fixes

* now sass is linked too ([ed30901](https://github.com/SUI-Components/sui/commit/ed30901))



<a name="3.17.0"></a>
# 3.17.0 (2018-08-07)


### Bug Fixes

* let autoprefixer comments to avoid problems ([be99f15](https://github.com/SUI-Components/sui/commit/be99f15))



<a name="3.16.0"></a>
# 3.16.0 (2018-08-07)


### Features

* remove all comments on CSS after building it ([d76cfa9](https://github.com/SUI-Components/sui/commit/d76cfa9))
* update all dependencies to latest and remove not used ones ([6576422](https://github.com/SUI-Components/sui/commit/6576422))



<a name="3.15.0"></a>
# 3.15.0 (2018-08-06)


### Bug Fixes

* use sui-bundler analyze wihout removed dependency ([b19a233](https://github.com/SUI-Components/sui/commit/b19a233))



<a name="3.14.0"></a>
# 3.14.0 (2018-08-06)


### Features

* bump version ([7d629cf](https://github.com/SUI-Components/sui/commit/7d629cf))



<a name="3.12.0"></a>
# 3.12.0 (2018-08-06)


### Bug Fixes

* fix error with default parameters ([05ef733](https://github.com/SUI-Components/sui/commit/05ef733))


### Features

* add link-loader ([8590edb](https://github.com/SUI-Components/sui/commit/8590edb))
* improve console output ([ce10da8](https://github.com/SUI-Components/sui/commit/ce10da8))



<a name="3.12.0"></a>
# 3.12.0 (2018-07-27)


### Features

* export a start function ([c5cc60b](https://github.com/SUI-Components/sui/commit/c5cc60b))
* option to not use version directory ([deb58bf](https://github.com/SUI-Components/sui/commit/deb58bf))



<a name="3.11.0"></a>
# 3.11.0 (2018-07-13)


### Bug Fixes

* fix Travis CI broken when used node 10 ([735fafa](https://github.com/SUI-Components/sui/commit/735fafa))



<a name="3.10.0"></a>
# 3.10.0 (2018-07-10)


### Bug Fixes

* allow last versions of sui-helpers ([3ec95d1](https://github.com/SUI-Components/sui/commit/3ec95d1))


### Features

* improve dev with eslint loader ([fe74597](https://github.com/SUI-Components/sui/commit/fe74597))
* use cacheBabel compiled ([00ba04c](https://github.com/SUI-Components/sui/commit/00ba04c))
* use react-dev-tools for dev command ([fc43780](https://github.com/SUI-Components/sui/commit/fc43780))



<a name="3.9.0"></a>
# 3.9.0 (2018-06-25)



<a name="3.8.0"></a>
# 3.8.0 (2018-06-21)


### Bug Fixes

* fix bundling in windows ([ed9c416](https://github.com/SUI-Components/sui/commit/ed9c416))
* use Object.assign instead spread operator ([4bab0f8](https://github.com/SUI-Components/sui/commit/4bab0f8))
* use Object.assign instead spread operator ([ecb8ac9](https://github.com/SUI-Components/sui/commit/ecb8ac9))



<a name="3.7.0"></a>
# 3.7.0 (2018-06-20)


### Features

* bump version ([c4d2567](https://github.com/SUI-Components/sui/commit/c4d2567))



<a name="3.6.0"></a>
# 3.6.0 (2018-06-20)


### Bug Fixes

* prepare for windows ([3dd607a](https://github.com/SUI-Components/sui/commit/3dd607a))


### Features

* add context option to build ([49285e5](https://github.com/SUI-Components/sui/commit/49285e5))
* use index.html like fallback ([b84e916](https://github.com/SUI-Components/sui/commit/b84e916))



<a name="3.5.0"></a>
# 3.5.0 (2018-06-13)


### Bug Fixes

* sui-bundler dev not using babel-preset-sui ([d0ca7ef](https://github.com/SUI-Components/sui/commit/d0ca7ef))



<a name="3.4.0"></a>
# 3.4.0 (2018-06-11)


### Features

* sui-bundler lib to bundle libraries ([4df41ac](https://github.com/SUI-Components/sui/commit/4df41ac))



<a name="3.3.0"></a>
# 3.3.0 (2018-05-10)


### Bug Fixes

* fix regression that runtime has not been created ([90994ff](https://github.com/SUI-Components/sui/commit/90994ff))



<a name="3.2.0"></a>
# 3.2.0 (2018-05-04)


### Bug Fixes

* avoid use Gently in the server config ([8d79955](https://github.com/SUI-Components/sui/commit/8d79955))



<a name="3.1.0"></a>
# 3.1.0 (2018-04-30)


### Bug Fixes

* use Object.assign for compatibility withh node 6 ([424da99](https://github.com/SUI-Components/sui/commit/424da99))



<a name="3.0.0"></a>
# 3.0.0 (2018-04-12)


### Bug Fixes

* loadUniversalOptionsPlugin in pro as well ([b069576](https://github.com/SUI-Components/sui/commit/b069576))


### Features

* adapt production configuration to be as development ([216fa61](https://github.com/SUI-Components/sui/commit/216fa61))
* adapt production configuration to new versions ([d6474d5](https://github.com/SUI-Components/sui/commit/d6474d5))
* merge ([6a3f18d](https://github.com/SUI-Components/sui/commit/6a3f18d))
* remove json-loader and use native instead ([a8d939f](https://github.com/SUI-Components/sui/commit/a8d939f))
* remove not needed loaders for some files and rollback to loader ([dd6a81a](https://github.com/SUI-Components/sui/commit/dd6a81a))
* return loaderOptionsPlugin to be used ([5b6c358](https://github.com/SUI-Components/sui/commit/5b6c358))
* update dependencies ([bbe43b1](https://github.com/SUI-Components/sui/commit/bbe43b1))
* update dependencies ([6788838](https://github.com/SUI-Components/sui/commit/6788838))
* update dependencies ([55217aa](https://github.com/SUI-Components/sui/commit/55217aa))
* update html-webpack-plugin version ([389f546](https://github.com/SUI-Components/sui/commit/389f546))


### BREAKING CHANGES

* Stop supporting a way to load fonts, images and other files on your code
* No support for loading fonts, svg and images from your project anymore



<a name="2.15.0"></a>
# 2.15.0 (2018-03-28)


### Bug Fixes

* specify include and avoid getting others babelrc than the one we want ([12f60af](https://github.com/SUI-Components/sui/commit/12f60af))
* update dependencies to fix some problems ([e2f8370](https://github.com/SUI-Components/sui/commit/e2f8370))


### Features

* add node-externals dep ([bd09441](https://github.com/SUI-Components/sui/commit/bd09441))
* add server config ([cbc8a01](https://github.com/SUI-Components/sui/commit/cbc8a01))
* relay more on default values ([99694b2](https://github.com/SUI-Components/sui/commit/99694b2))
* remove deprecated way to add to the loader the config on PRO ([b9fb841](https://github.com/SUI-Components/sui/commit/b9fb841))
* stop using old loader for webpack 2 and kiss ([0a83817](https://github.com/SUI-Components/sui/commit/0a83817))
* update dependencies ([e448b94](https://github.com/SUI-Components/sui/commit/e448b94))
* update dependencies ([988eb62](https://github.com/SUI-Components/sui/commit/988eb62))
* update dependencies to latest versions and ensure Webpack 4 compatibility ([9771c45](https://github.com/SUI-Components/sui/commit/9771c45))
* update node-sass-json-importer ([9da5273](https://github.com/SUI-Components/sui/commit/9da5273))
* update to latest dependencies con hotfixes and webpack 4 support ([8ef23f7](https://github.com/SUI-Components/sui/commit/8ef23f7))
* use latest versions of dependencies ([2237dfe](https://github.com/SUI-Components/sui/commit/2237dfe))
* use manual vendor ([b03e2f6](https://github.com/SUI-Components/sui/commit/b03e2f6))



<a name="2.14.0"></a>
# 2.14.0 (2018-02-28)


### Features

* translate to english ([d8d812f](https://github.com/SUI-Components/sui/commit/d8d812f))
* update dependencies ([3b3c74a](https://github.com/SUI-Components/sui/commit/3b3c74a))
* update dependencies ([bda676d](https://github.com/SUI-Components/sui/commit/bda676d))
* use babel-loader new version compatible with webpack 4 ([e7defdf](https://github.com/SUI-Components/sui/commit/e7defdf))



<a name="2.13.0"></a>
# 2.13.0 (2018-02-22)


### Features

* add a way to modify the config for Webpack's scriptsExtPlugin ([51cdfac](https://github.com/SUI-Components/sui/commit/51cdfac))



<a name="2.12.0"></a>
# 2.12.0 (2018-02-05)


### Features

* show the time used for dev bundling ([5ffb110](https://github.com/SUI-Components/sui/commit/5ffb110))
* use new modules use rules ([cafb5bb](https://github.com/SUI-Components/sui/commit/cafb5bb))



<a name="2.11.0"></a>
# 2.11.0 (2017-12-28)


### Features

* remove browser-sync as not being used anywhere and adding building time ([ad513a2](https://github.com/SUI-Components/sui/commit/ad513a2))



<a name="2.10.0"></a>
# 2.10.0 (2017-11-10)


### Features

* update to latest webpack version ([5efa34f](https://github.com/SUI-Components/sui/commit/5efa34f))
* use new uglifyJSPlugin version ([ae6830e](https://github.com/SUI-Components/sui/commit/ae6830e))



<a name="2.9.0"></a>
# 2.9.0 (2017-09-21)


### Bug Fixes

* replace references to sui-studio by s-ui/studio ([4dfffb9](https://github.com/SUI-Components/sui/commit/4dfffb9))



<a name="2.8.0"></a>
# 2.8.0 (2017-09-21)


### Bug Fixes

* replace references to schibstedspain ([cd17403](https://github.com/SUI-Components/sui/commit/cd17403))



<a name="2.7.0"></a>
# 2.7.0 (2017-09-21)


### Features

* move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([2687a1f](https://github.com/SUI-Components/sui/commit/2687a1f))



<a name="2.6.0"></a>
# 2.6.0 (2017-09-13)



<a name="2.5.0"></a>
# 2.5.0 (2017-08-29)


### Bug Fixes

* fix build broken in windows ([2b6441e](https://github.com/SUI-Components/sui/commit/2b6441e))



<a name="1.20.0"></a>
# 1.20.0 (2017-08-29)



<a name="2.4.0"></a>
# 2.4.0 (2017-08-29)


### Bug Fixes

* fix json files not loading in sass imports ([02677c1](https://github.com/SUI-Components/sui/commit/02677c1))



<a name="2.3.0"></a>
# 2.3.0 (2017-08-09)


### Bug Fixes

* working inside the sui-studio ([c782bf0](https://github.com/SUI-Components/sui/commit/c782bf0))



<a name="2.2.0"></a>
# 2.2.0 (2017-07-27)


### Bug Fixes

* fix problems with postCss because API changed for the loader ([e60ed20](https://github.com/SUI-Components/sui/commit/e60ed20))



<a name="2.1.0"></a>
# 2.1.0 (2017-07-27)


### Features

* update to webpack 3.4.0 ([b28275b](https://github.com/SUI-Components/sui/commit/b28275b))



<a name="1.5.0"></a>
# 1.5.0 (2017-07-17)


### Bug Fixes

* fix wrong way to check hasErrors and hasWarnings, always was undefined ([b5b8421](https://github.com/SUI-Components/sui/commit/b5b8421))


### Features

* add Duplicated NPM Package checker on analyzing ([1809284](https://github.com/SUI-Components/sui/commit/1809284))



<a name="1.4.0"></a>
# 1.4.0 (2017-07-10)


### Bug Fixes

* use contenthash because chunkhash sometimes doesnt change ([ca03399](https://github.com/SUI-Components/sui/commit/ca03399))



<a name="1.3.0"></a>
# 1.3.0 (2017-07-05)


### Features

* use prefetch instead preload to avoid blocking requests ([582d59e](https://github.com/SUI-Components/sui/commit/582d59e)), closes [#41](https://github.com/SUI-Components/sui/issues/41)



<a name="1.2.0"></a>
# 1.2.0 (2017-07-04)


### Bug Fixes

* remove react alias as not need ([9db2e7a](https://github.com/SUI-Components/sui/commit/9db2e7a))


### Features

* rename package and its binary ([0f57470](https://github.com/SUI-Components/sui/commit/0f57470))
* update sui-bundler from suistudio-webpack ([5bd67f4](https://github.com/SUI-Components/sui/commit/5bd67f4))


### BREAKING CHANGES

* CLI has changed name



