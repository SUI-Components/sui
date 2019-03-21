# Change Log

All notable changes to this project will be documented in this file.

<a name="2.9.0"></a>
# 2.9.0 (2019-03-18)


### Features

* Move to babel-preset-sui@3 ([b32c0eb](https://github.com/SUI-Components/sui/commit/b32c0eb))



<a name="2.8.0"></a>
# 2.8.0 (2019-03-11)


### Features

* add support for some proposal export babel plugins ([4294717](https://github.com/SUI-Components/sui/commit/4294717))



<a name="2.7.0"></a>
# 2.7.0 (2019-02-20)


### Bug Fixes

* remove not needed caret ([99515eb](https://github.com/SUI-Components/sui/commit/99515eb))
* transform export default from for sui-test and karma-webpack ([99b11f2](https://github.com/SUI-Components/sui/commit/99b11f2))



<a name="2.6.0"></a>
# 2.6.0 (2019-02-19)


### Bug Fixes

* add NODE_ENV to be injected ([05fd3ca](https://github.com/SUI-Components/sui/commit/05fd3ca))
* transform dynamic import as karma-webpack doesnt support it for now ([8223bae](https://github.com/SUI-Components/sui/commit/8223bae))



<a name="2.5.0"></a>
# 2.5.0 (2019-02-19)


### Bug Fixes

* mock fs dependency on browser ([8db361b](https://github.com/SUI-Components/sui/commit/8db361b))



<a name="2.4.0"></a>
# 2.4.0 (2019-02-19)


### Features

* remove Browserify and change it by webpack ([ff5a9eb](https://github.com/SUI-Components/sui/commit/ff5a9eb))



<a name="2.3.0"></a>
# 2.3.0 (2019-02-04)


### Features

* remove browserify babel instanbul ([b150398](https://github.com/SUI-Components/sui/commit/b150398))



<a name="2.2.0"></a>
# 2.2.0 (2019-02-01)


### Bug Fixes

* export using commonjs ([0041a36](https://github.com/SUI-Components/sui/commit/0041a36))



<a name="2.1.0"></a>
# 2.1.0 (2019-01-14)


### Bug Fixes

* add new polyfill from babel@7 instead using old one ([f5f8024](https://github.com/SUI-Components/sui/commit/f5f8024))



<a name="2.0.0"></a>
# 2.0.0 (2019-01-14)


### Features

* use babel@7 ([91f54a2](https://github.com/SUI-Components/sui/commit/91f54a2))
* use latest babel-preset-sui ([bb4347f](https://github.com/SUI-Components/sui/commit/bb4347f))


### BREAKING CHANGES

* Using babel@7
* Old code might be needed to be adapted in order to get it working as we are moving to babel 7



<a name="1.20.0"></a>
# 1.20.0 (2019-01-14)


### Bug Fixes

* remove unused file-system dependency ([3c46016](https://github.com/SUI-Components/sui/commit/3c46016))


### Features

* support file option added to e2e tests ([2f95361](https://github.com/SUI-Components/sui/commit/2f95361)), closes [#459](https://github.com/SUI-Components/sui/issues/459)



<a name="1.16.0"></a>
# 1.16.0 (2019-01-03)


### Features

* add overwrite user agent option ([869425b](https://github.com/SUI-Components/sui/commit/869425b)), closes [#446](https://github.com/SUI-Components/sui/issues/446)
* support new babel@7 ([f6270f2](https://github.com/SUI-Components/sui/commit/f6270f2))
* upgrade to [@babel](https://github.com/babel)/7 ([f107b2f](https://github.com/SUI-Components/sui/commit/f107b2f))


### BREAKING CHANGES

* Use new @babel/7 and and upgrade dependencies, so not compatible with babel@6 packages



<a name="1.14.0"></a>
# 1.14.0 (2018-09-26)


### Features

* add force pattern to use sui-test in a webapp like repository ([527e5d2](https://github.com/SUI-Components/sui/commit/527e5d2))
* define the src directory to override the default one ([3cb7307](https://github.com/SUI-Components/sui/commit/3cb7307))
* Remove console.log ([6532569](https://github.com/SUI-Components/sui/commit/6532569))



<a name="1.13.0"></a>
# [1.13.0](https://github.com/SUI-Components/sui/compare/4.13.0...v2.17.1) (2018-08-31)


### Features

* added support dynamic import when we run ci test ([5666f82](https://github.com/SUI-Components/sui/commit/5666f82))



<a name="1.12.0"></a>
# 1.12.0 (2018-08-29)


### Features

* added support to dynamic imports in server side ([77f4ac2](https://github.com/SUI-Components/sui/commit/77f4ac2))



<a name="1.11.0"></a>
# 1.11.0 (2018-08-10)


### Features

* add option to scope e2e tests ([bd582e7](https://github.com/SUI-Components/sui/commit/bd582e7))



<a name="1.10.0"></a>
# 1.10.0 (2018-08-10)


### Bug Fixes

* allow dynamic imports ([31cacc6](https://github.com/SUI-Components/sui/commit/31cacc6))


### Features

* hide fixtures folder ([d094c60](https://github.com/SUI-Components/sui/commit/d094c60))
* upgrade cypress ([2f2e864](https://github.com/SUI-Components/sui/commit/2f2e864))



<a name="1.9.0"></a>
# 1.9.0 (2018-07-10)


### Features

* upgrade cypress ([055c88a](https://github.com/SUI-Components/sui/commit/055c88a))



<a name="1.8.0"></a>
# 1.8.0 (2018-06-11)


### Bug Fixes

* fix format problems in user-agent option ([48e9d90](https://github.com/SUI-Components/sui/commit/48e9d90))



<a name="1.7.0"></a>
# 1.7.0 (2018-05-30)


### Bug Fixes

* add require(path) where needed ([4df4b5c](https://github.com/SUI-Components/sui/commit/4df4b5c))
* arrange paths for windows ([1274b7c](https://github.com/SUI-Components/sui/commit/1274b7c))



<a name="1.6.0"></a>
# 1.6.0 (2018-05-17)


### Bug Fixes

* cypress config format broken in windows ([723cd44](https://github.com/SUI-Components/sui/commit/723cd44))



<a name="1.5.0"></a>
# 1.5.0 (2018-04-16)


### Features

* changed api name to .client and .server ([033b43f](https://github.com/SUI-Components/sui/commit/033b43f))
* changed some naming parameters to positional ([f99ab91](https://github.com/SUI-Components/sui/commit/f99ab91))
* create the base of the patcher and add some dependencies for bundling ([bf561d2](https://github.com/SUI-Components/sui/commit/bf561d2))
* rename function to avoid collision with .only mocha function name ([c99e40a](https://github.com/SUI-Components/sui/commit/c99e40a))



<a name="1.3.0"></a>
# 1.3.0 (2018-03-20)


### Bug Fixes

* dumb commit to force release ([8c96ec8](https://github.com/SUI-Components/sui/commit/8c96ec8))



<a name="1.2.0"></a>
# 1.2.0 (2018-03-08)


### Bug Fixes

* move e2e test to an exclusive folder ([4aa9f69](https://github.com/SUI-Components/sui/commit/4aa9f69))


### Features

* sui-test e2e command ([4b48cb6](https://github.com/SUI-Components/sui/commit/4b48cb6))



<a name="1.1.0"></a>
# 1.1.0 (2018-03-05)


### Bug Fixes

* converge pattern from server and browser ([cec0c2e](https://github.com/SUI-Components/sui/commit/cec0c2e))


### Features

* add pattern and ignorePattern parameters for sui-test browser ([fa8515a](https://github.com/SUI-Components/sui/commit/fa8515a))
* add pattern parameters for sui-test server ([546536a](https://github.com/SUI-Components/sui/commit/546536a))
* use the new parameter in order to add an exclude param and create files to test ([c5b034c](https://github.com/SUI-Components/sui/commit/c5b034c))



<a name="1.0.0"></a>
# 1.0.0 (2018-02-16)


### Features

* bump beta version ([9dc81af](https://github.com/SUI-Components/sui/commit/9dc81af))
* first full functional version ([93f786e](https://github.com/SUI-Components/sui/commit/93f786e))



