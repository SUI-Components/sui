# CHANGELOG

# 4.10.0 (2021-02-02)


### Bug Fixes

* use args for command ([0172ebf](https://github.com/SUI-Components/sui/commit/0172ebfeea59e5cd56f4535297a7ec7de8972e34))
* use previous project uri ([b7e073f](https://github.com/SUI-Components/sui/commit/b7e073f121abc87208089624c346c325b3b5ab76))


### Features

* add support to parallelization ([cab916c](https://github.com/SUI-Components/sui/commit/cab916c68af4072ddeb8f8473154d567ac1bc051))



# 4.9.0 (2020-12-30)


### Bug Fixes

* force new release of sui-test docker ([ebe3460](https://github.com/SUI-Components/sui/commit/ebe34605751e87a3941a46baf4e4af24940533e0))



# 4.8.0 (2020-12-30)


### Bug Fixes

* Do not catch error for getSpawnPromise ([e47120e](https://github.com/SUI-Components/sui/commit/e47120eb4880e5f365223a4d327cdbb54c28ac14))



# 4.7.0 (2020-12-22)


### Features

* Use latest and same commander version and avoid installing different versions ([d1e8368](https://github.com/SUI-Components/sui/commit/d1e8368e5202386997b8ff673d18c80f342f6c4b))



# 4.6.0 (2020-12-01)


### Bug Fixes

* transpile babel-runtime as sometimes that's needed ([1500c49](https://github.com/SUI-Components/sui/commit/1500c49edb0af21e56cbbaa8eeb32fa03b1c59c9))



# 4.5.0 (2020-11-16)


### Features

* remove srcPattern default as it is causing problems ([8b8e8c0](https://github.com/SUI-Components/sui/commit/8b8e8c03cc8d1151b29bf215d6ffd706ccd20ef8))
* upgrade dependencies ([a84c4e1](https://github.com/SUI-Components/sui/commit/a84c4e12720175246e379784006eeca3cb5ac126))
* use latest karma ([5789dc6](https://github.com/SUI-Components/sui/commit/5789dc6a87952237d7366100f81e42cc7d30ea87))



# 4.4.0 (2020-11-12)


### Features

* try new release with new GitHub Actions build ([b15856a](https://github.com/SUI-Components/sui/commit/b15856acccc37dd86efa8603b43489ea57f522ab))



# 4.3.0 (2020-11-09)


### Features

* disable ESModules on babel-preset-sui for mocha server tests ([e5c3a9b](https://github.com/SUI-Components/sui/commit/e5c3a9b5df5b0cbd75276b550b9b97d5ec53dde1))



# 4.2.0 (2020-10-30)


### Features

* add a config to force transpilation of modules via config ([d85e9ef](https://github.com/SUI-Components/sui/commit/d85e9efaa6d566cae901b7370d094d44d8c6efe8))



# 4.1.0 (2020-10-21)


### Features

* upgrade sui-test dependencies ([2b590c4](https://github.com/SUI-Components/sui/commit/2b590c4617ab0375f45da248317dc2d0adf9479c))



# 4.0.0 (2020-09-30)


### Features

* adap sui-test to use componentKey instead displayName ([ba33c39](https://github.com/SUI-Components/sui/commit/ba33c39c137df8f346939770cc2abab708357d6c))
* use babel-cli from root instead dependency ([9dbcac5](https://github.com/SUI-Components/sui/commit/9dbcac55d3889ec7537487fd99b38251348f7c7a))


### BREAKING CHANGES

* New babel patch for describe.context test for studio



# 3.4.0 (2020-09-02)


### Features

* add support to svg import on null-loader ([20449f0](https://github.com/SUI-Components/sui/commit/20449f06c2c9474947d1c86877c40b5413e8e3f2))



# 3.3.0 (2020-08-25)


### Bug Fixes

* fix ci test errors ([27e33ed](https://github.com/SUI-Components/sui/commit/27e33ed8bbcfa78aa36fcdeb6210bd18935d8ff6))


### Features

* add null-loader ([b34324d](https://github.com/SUI-Components/sui/commit/b34324d88ce5dd3e31f6cacbe19215549eefcc01))



# 3.2.0 (2020-06-23)


### Bug Fixes

* add resolve importers extension to the test-browser webpack conf ([8c4eaab](https://github.com/SUI-Components/sui/commit/8c4eaab20465cf1828ab46c2bc98a5208bf83310))
* webpack config ([357d81f](https://github.com/SUI-Components/sui/commit/357d81fa603f8c76e90c1398c838e7468847f1df))


### Features

* remove sui-bundler dependency ([4f2b5cb](https://github.com/SUI-Components/sui/commit/4f2b5cbda67d7cfce9506ab00babda4d1a753ad2))



# 3.1.0 (2020-06-08)


### Features

* add --browser flag to e2e ([5227956](https://github.com/SUI-Components/sui/commit/5227956a92b347c1d242c915f122b81b6aa05e0a))
* add --noWebSecurity flag to e2e testing ([1eab372](https://github.com/SUI-Components/sui/commit/1eab372a3583c9580a5866c79aac800ca37b0cc9))
* add news flag to README ([ac98c2a](https://github.com/SUI-Components/sui/commit/ac98c2a8976e856abe46f1cc86cfbda6129aeadd))
* adds a cli testing bundling support for studio ([bd89687](https://github.com/SUI-Components/sui/commit/bd89687a9af8e7aed496fbefae055a946ced0afb))
* enable src-pattern flag ([e7979af](https://github.com/SUI-Components/sui/commit/e7979affed024b721e884351042c679e46edfcf6))
* fix the version on package.json ([ebfbec6](https://github.com/SUI-Components/sui/commit/ebfbec67d7bc7bbb53591ca7bec71610c15285ed))



# 3.0.0 (2020-04-08)


### Bug Fixes

* install cypress in docker ([3ab59b9](https://github.com/SUI-Components/sui/commit/3ab59b9c7d05106ad8a0de184aa7878a4ad5efc5))


### Features

* add ci mode and update cypress version ([46dfeb6](https://github.com/SUI-Components/sui/commit/46dfeb602f135cd263c176a11572a156aa6f87cd))
* update all cypress version definitions ([1d9dfeb](https://github.com/SUI-Components/sui/commit/1d9dfeb8990c803842d8f98e5423d7ab9f9f617e))
* update cypress dep ([ac837d4](https://github.com/SUI-Components/sui/commit/ac837d46fec38912a844a3d493575975ab2ba163))


### BREAKING CHANGES

* update cypress version



# 2.24.0 (2020-01-23)


### Features

* add key fla ([f544f1f](https://github.com/SUI-Components/sui/commit/f544f1f79b19832bc6965ecff28ac057baee84b4))
* add key flag ([5d33e93](https://github.com/SUI-Components/sui/commit/5d33e939936d4cedee88209768060f718b787c90))
* add record flag ([ff5bca3](https://github.com/SUI-Components/sui/commit/ff5bca396b113b07c8bac88118ddfa65f8113322))



# 2.23.0 (2020-01-21)


### Bug Fixes

* set properly the timeout in browser and server ([1379668](https://github.com/SUI-Components/sui/commit/1379668bc9d6122d1c539f0597f3815ce54e39b1))



# 2.22.0 (2019-12-16)


### Bug Fixes

* restore spec reporter ([1c99a23](https://github.com/SUI-Components/sui/commit/1c99a23a0f9697b2e795e44051f51f55d85054e1))



# 2.21.0 (2019-12-10)


### Features

* add test timeout customization ([fc0391b](https://github.com/SUI-Components/sui/commit/fc0391be9744190c7d3523eeed264dff7f9ba017))
* timeout ([7b6de78](https://github.com/SUI-Components/sui/commit/7b6de783013095759322273dd7fce4b1278b14b7))



# 2.20.0 (2019-12-05)


### Features

* better config for report ([3a79cda](https://github.com/SUI-Components/sui/commit/3a79cda7e8034cb9d65095ecea01246a3f55405a))
* remove deprecated dependency ([caac087](https://github.com/SUI-Components/sui/commit/caac0871366cf68373699cd164779aed008ca393))
* remove not needed plugins for mocha server (already in sui preset) ([348d18e](https://github.com/SUI-Components/sui/commit/348d18e0b1be91c4b1b5c082f647081aa94bcc37))
* upgrade dependencies ([7cdac03](https://github.com/SUI-Components/sui/commit/7cdac035fa0ad3dd36890c9f4fc22895930aab48))
* upgrade dependencies ([52be959](https://github.com/SUI-Components/sui/commit/52be95969e5fc461efdc1148109cd5b7ae75c865))


### Performance Improvements

* remove not needed plugins from config ([84eba09](https://github.com/SUI-Components/sui/commit/84eba0996685e5d987ad56b065f918c7e2f0441c))



# 2.19.0 (2019-11-08)


### Bug Fixes

* avoid swallow error code in server execution ([e1597ff](https://github.com/SUI-Components/sui/commit/e1597ff2f9f35966919eeeda349596cd0477600f))



# 2.18.0 (2019-10-23)


### Features

* Improve sui-test browser performance and avoid memory problems ([fa55300](https://github.com/SUI-Components/sui/commit/fa55300abb0baca185ff1bec26d106cff1ab119d))
* Upgrade dependencies ([0ed869d](https://github.com/SUI-Components/sui/commit/0ed869d1eaa940225f9cc6be51313133271647fc))



# 2.17.0 (2019-07-03)


### Bug Fixes

* export instead of exports ([3a27522](https://github.com/SUI-Components/sui/commit/3a27522c5e0bce03026bc930a6b903955ff8125f))



# 2.16.0 (2019-06-19)


### Bug Fixes

* babel/register is using import/export and expecting webpack to be used ([0fae033](https://github.com/SUI-Components/sui/commit/0fae03347ba11317689cf45d91139c77b11873ea))



# 2.15.0 (2019-05-31)


### Features

* add inspect flag to server command ([aae232e](https://github.com/SUI-Components/sui/commit/aae232e22cdf3f81f889572c3514267ba14ba9fa))



# 2.14.0 (2019-04-26)


### Bug Fixes

* dont export CYPRESS_VERSION ([315ab70](https://github.com/SUI-Components/sui/commit/315ab70b75adb27fd9551c5857ba6bedceb0ff16))
* export CYPRESS_VERSION like env var ([8ebfdbc](https://github.com/SUI-Components/sui/commit/8ebfdbc87ab7ac9fcf3f1a599a773d778b4b257f))


### Features

* Bump version ([06bc402](https://github.com/SUI-Components/sui/commit/06bc4023400f9a61085ce9a5a9df2277409c1a56))



# 2.11.0 (2019-04-25)


### Features

* upgrade cypress to 3.2.0 version ([6104316](https://github.com/SUI-Components/sui/commit/61043168c7bd4a334626292d465f5226c5eea146))



# 2.10.0 (2019-04-18)


### Bug Fixes

* npm install command add --save-dev flag ([47fc0b3](https://github.com/SUI-Components/sui/commit/47fc0b392bdc467d725ccebc02cf8120331468b2))


### Features

* build a Docker image in each release ([11f0279](https://github.com/SUI-Components/sui/commit/11f02797d8e250d8d20ef0faed7d0f4bab301b5e))
* move cypressVersion to package.json ([46577c2](https://github.com/SUI-Components/sui/commit/46577c29c8a4b2381ca2acf8dc3af0b2490a4898))



# 2.9.0 (2019-03-18)


### Features

* Move to babel-preset-sui@3 ([b32c0eb](https://github.com/SUI-Components/sui/commit/b32c0eb6dac0e36052adc3644b859877994bb25c))



# 2.8.0 (2019-03-11)


### Features

* add support for some proposal export babel plugins ([4294717](https://github.com/SUI-Components/sui/commit/4294717fdb1d511ca0211a9dacba9d77fca15644))



# 2.7.0 (2019-02-20)


### Bug Fixes

* remove not needed caret ([99515eb](https://github.com/SUI-Components/sui/commit/99515eb1f3ae031d81df71fabc8d37f8432d1ae8))
* transform export default from for sui-test and karma-webpack ([99b11f2](https://github.com/SUI-Components/sui/commit/99b11f29ed44827a47e3a146a0817f371bd7db97))



# 2.6.0 (2019-02-19)


### Bug Fixes

* add NODE_ENV to be injected ([05fd3ca](https://github.com/SUI-Components/sui/commit/05fd3ca665539ebef5f9e2fa150b936fc0efa949))
* transform dynamic import as karma-webpack doesnt support it for now ([8223bae](https://github.com/SUI-Components/sui/commit/8223bae2be23d2199b743a1c125a58145137ff50))



# 2.5.0 (2019-02-19)


### Bug Fixes

* mock fs dependency on browser ([8db361b](https://github.com/SUI-Components/sui/commit/8db361b9642e1874d17932ece30171199a11eec1))



# 2.4.0 (2019-02-19)


### Features

* remove Browserify and change it by webpack ([ff5a9eb](https://github.com/SUI-Components/sui/commit/ff5a9ebe7b40fc0d1089962228bd2f46042cd10a))



# 2.3.0 (2019-02-04)


### Features

* remove browserify babel instanbul ([b150398](https://github.com/SUI-Components/sui/commit/b150398810b0e3b60bfbd3ba616a82fc2237f491))



# 2.2.0 (2019-02-01)


### Bug Fixes

* export using commonjs ([0041a36](https://github.com/SUI-Components/sui/commit/0041a36dfd18598e0e0fe8f4c39f0c04ab3b7e28))



# 2.1.0 (2019-01-14)


### Bug Fixes

* add new polyfill from babel@7 instead using old one ([f5f8024](https://github.com/SUI-Components/sui/commit/f5f802408155e35dd6a1ac7888c521ca1f243f24))



# 2.0.0 (2019-01-14)


### Features

* use babel@7 ([91f54a2](https://github.com/SUI-Components/sui/commit/91f54a2988aa9e5c610bb8684976dff9c938c951))
* use latest babel-preset-sui ([bb4347f](https://github.com/SUI-Components/sui/commit/bb4347f4b05d04f34b77d7570a5b147b78504e35))


### BREAKING CHANGES

* Using babel@7
* Old code might be needed to be adapted in order to get it working as we are moving to babel 7



# 1.20.0 (2019-01-14)


### Bug Fixes

* remove unused file-system dependency ([3c46016](https://github.com/SUI-Components/sui/commit/3c46016db112a7bf9b68172d315f66af59f3457a))


### Features

* support file option added to e2e tests ([2f95361](https://github.com/SUI-Components/sui/commit/2f953618bb639e62eecfd257e3c1f5bea3504219)), closes [#459](https://github.com/SUI-Components/sui/issues/459)



# 1.16.0 (2019-01-03)


### Features

* add overwrite user agent option ([869425b](https://github.com/SUI-Components/sui/commit/869425b0dc837c139243ef127d8cea2be3b57632)), closes [#446](https://github.com/SUI-Components/sui/issues/446)
* support new babel@7 ([f6270f2](https://github.com/SUI-Components/sui/commit/f6270f2322b250dabacdf647a0e3f28076a4e9e5))
* upgrade to @babel/7 ([f107b2f](https://github.com/SUI-Components/sui/commit/f107b2f81c127b2e7bbd826e1301b15607b72789))


### BREAKING CHANGES

* Use new @babel/7 and and upgrade dependencies, so not compatible with babel@6 packages



# 1.14.0 (2018-09-26)


### Features

* add force pattern to use sui-test in a webapp like repository ([527e5d2](https://github.com/SUI-Components/sui/commit/527e5d288c04310dc8a8970c3dc66c062a289254))
* define the src directory to override the default one ([3cb7307](https://github.com/SUI-Components/sui/commit/3cb7307db042810b07a1355eb6a993edd24e6063))
* Remove console.log ([6532569](https://github.com/SUI-Components/sui/commit/6532569601de0628031c8c33f826c40b1bb5f39c))



# [1.13.0](https://github.com/SUI-Components/sui/compare/4.13.0...v2.17.1) (2018-08-31)


### Features

* added support dynamic import when we run ci test ([5666f82](https://github.com/SUI-Components/sui/commit/5666f822bf98757cb9a01dfe3c04d7b24fa8cc00))



# 1.12.0 (2018-08-29)


### Features

* added support to dynamic imports in server side ([77f4ac2](https://github.com/SUI-Components/sui/commit/77f4ac21f2e58eddf43b0d2af8dd55ce18ce50d5))



# 1.11.0 (2018-08-10)


### Features

* add option to scope e2e tests ([bd582e7](https://github.com/SUI-Components/sui/commit/bd582e71e462194dc4f468df1aaded79cb0c8f01))



# 1.10.0 (2018-08-10)


### Bug Fixes

* allow dynamic imports ([31cacc6](https://github.com/SUI-Components/sui/commit/31cacc6c5f29ef44c873e8116bd2b182a605c27e))


### Features

* hide fixtures folder ([d094c60](https://github.com/SUI-Components/sui/commit/d094c60f91923a1a56079854be9c447c33946dd1))
* upgrade cypress ([2f2e864](https://github.com/SUI-Components/sui/commit/2f2e8645c37552910efd995e13db62f93768ed75))



# 1.9.0 (2018-07-10)


### Features

* upgrade cypress ([055c88a](https://github.com/SUI-Components/sui/commit/055c88a0736d16c18f431a6c4ed2b0a9f0714a44))



# 1.8.0 (2018-06-11)


### Bug Fixes

* fix format problems in user-agent option ([48e9d90](https://github.com/SUI-Components/sui/commit/48e9d90de62b5a12fd6a3497f4cf514806b7aac9))



# 1.7.0 (2018-05-30)


### Bug Fixes

* add require(path) where needed ([4df4b5c](https://github.com/SUI-Components/sui/commit/4df4b5ca484a9c66b5c921cdc0da375f4322e9c2))
* arrange paths for windows ([1274b7c](https://github.com/SUI-Components/sui/commit/1274b7c783b71af1584751868d6615279b635f30))



# 1.6.0 (2018-05-17)


### Bug Fixes

* cypress config format broken in windows ([723cd44](https://github.com/SUI-Components/sui/commit/723cd4489f0a605ef086e45738e698ef19d6c29c))



# 1.5.0 (2018-04-16)


### Features

* changed api name to .client and .server ([033b43f](https://github.com/SUI-Components/sui/commit/033b43f6f159f48c2902b6ce69d136a988947ba7))
* changed some naming parameters to positional ([f99ab91](https://github.com/SUI-Components/sui/commit/f99ab91b8f9388b49e2a049623629ebe0db7c0ef))
* create the base of the patcher and add some dependencies for bundling ([bf561d2](https://github.com/SUI-Components/sui/commit/bf561d217973a9f304057880381ebb407a030f99))
* rename function to avoid collision with .only mocha function name ([c99e40a](https://github.com/SUI-Components/sui/commit/c99e40a6e44e708cb3f6cd749006cbd26559d3b5))



# 1.3.0 (2018-03-20)


### Bug Fixes

* dumb commit to force release ([8c96ec8](https://github.com/SUI-Components/sui/commit/8c96ec885b5563a7f22b66c4dff60286e25430a4))



# 1.2.0 (2018-03-08)


### Bug Fixes

* move e2e test to an exclusive folder ([4aa9f69](https://github.com/SUI-Components/sui/commit/4aa9f69027f0cf87fb2b94b8f3bba306597cc075))


### Features

* sui-test e2e command ([4b48cb6](https://github.com/SUI-Components/sui/commit/4b48cb649046626fa610f424a74a51ef1108b89b))



# 1.1.0 (2018-03-05)


### Bug Fixes

* converge pattern from server and browser ([cec0c2e](https://github.com/SUI-Components/sui/commit/cec0c2ea05867fe261de81bdf502c0d67e6be88f))


### Features

* add pattern and ignorePattern parameters for sui-test browser ([fa8515a](https://github.com/SUI-Components/sui/commit/fa8515ac3b8e25b31b7955b5514c4fd7f5c16ff4))
* add pattern parameters for sui-test server ([546536a](https://github.com/SUI-Components/sui/commit/546536aa125ebd404c66a03eacd02c93495a417c))
* use the new parameter in order to add an exclude param and create files to test ([c5b034c](https://github.com/SUI-Components/sui/commit/c5b034ce56c8a01afd9540e1644abe6904061250))



# 1.0.0 (2018-02-16)


### Features

* bump beta version ([9dc81af](https://github.com/SUI-Components/sui/commit/9dc81afbde098e6e03d586d6cf20e19076355e17))
* first full functional version ([93f786e](https://github.com/SUI-Components/sui/commit/93f786ed955d2c70aee1d8f8dacde46760696c2e))



