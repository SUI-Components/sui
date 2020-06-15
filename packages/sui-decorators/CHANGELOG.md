# Change Log

All notable changes to this project will be documented in this file.

# 3.16.0 (2020-06-04)


### Bug Fixes

* add redis-mock and hot-shot to dependencies ([4267659](https://github.com/SUI-Components/sui/commit/42676596e615b16b025b48fd238fcf269df8bc42))



# 3.14.0 (2020-06-04)


### Bug Fixes

* fix redis cache in browser ([d451f15](https://github.com/SUI-Components/sui/commit/d451f157380e4d8f57ff7e2043ebf4b57bbf5635))



# 3.13.0 (2020-06-04)


### Features

* inMemory cache handler ([3450125](https://github.com/SUI-Components/sui/commit/3450125b66ea474d777d0f7f9afce1b0592270ed))
* inRedis cache handler ([17f2482](https://github.com/SUI-Components/sui/commit/17f2482dfb3a13ef919fe34f54ad40310d028541))
* redis and isNode condition ([6e07a67](https://github.com/SUI-Components/sui/commit/6e07a6751a87ee25068823465b17527a038335c6))
* redis client ([912aa68](https://github.com/SUI-Components/sui/commit/912aa688a5fe7e703fd56467882c59805c9ca574))
* using inMemory and inRedis cache handlers ([f5a1680](https://github.com/SUI-Components/sui/commit/f5a1680feaa76de1e715c49d3917d28d897c3de2))



# 3.12.0 (2020-05-27)


### Bug Fixes

* cache key className+fnName and fix error case condition ([86ff64e](https://github.com/SUI-Components/sui/commit/86ff64ef5922851e619737ba4f050bd67a1ef1e6))



# 3.11.0 (2020-03-25)


### Features

* add browser field to package json for perf_hooks module ([bcad2d1](https://github.com/SUI-Components/sui/commit/bcad2d18ce9827138a95991f8fe79243e2cd3cb9))
* add class and method as default if no metricname is specified ([c7bfaad](https://github.com/SUI-Components/sui/commit/c7bfaad3905a2e26845bf8408c2a92c80bce131c))
* add console reporter for new tracer decorator ([d954871](https://github.com/SUI-Components/sui/commit/d954871fcfab002fcae5dc4293be965a18737469))
* add default value for metricName ([b23e992](https://github.com/SUI-Components/sui/commit/b23e992f5bb512d9bd24d9c81097f8bd5c92bb35))
* add frontend. to metric string names, linting ([0915044](https://github.com/SUI-Components/sui/commit/0915044688f31c59bb864a295cf949c5b2fb0fd2))
* add new Tracer decorator ([94b928f](https://github.com/SUI-Components/sui/commit/94b928f61715afee612ce653472ffc9624c3d813))
* add siteName ([517c856](https://github.com/SUI-Components/sui/commit/517c856cf2b9a5711a6d5dfd3f5627d222799b42))
* add statusCodes file for tracer decorator ([7c4772b](https://github.com/SUI-Components/sui/commit/7c4772b6ce58040ed4752481bcf87d86831a0b8c))
* dataDogReporter export ([8a3f4c8](https://github.com/SUI-Components/sui/commit/8a3f4c8cbb404d4857208449b2e728a20b7777b5))
* import new tracer decorator in index file ([704090c](https://github.com/SUI-Components/sui/commit/704090c512e19792e6cfafb03193ccbe5dd9727d))
* pass arguments from original function ([731b684](https://github.com/SUI-Components/sui/commit/731b684a1766dee23a158997c5d93fb113472c25))
* wip datadog reporter ([9e34ece](https://github.com/SUI-Components/sui/commit/9e34ecee6b0ed95c8e0ca8e0b2abff8dcf68059e))



# 3.10.0 (2019-10-24)


### Bug Fixes

* rollback to old tiny-lru to avoid class usage ([cd63db6](https://github.com/SUI-Components/sui/commit/cd63db6d66b3b119c3921311dde8938556fc9ec3))



# 3.9.0 (2019-10-23)


### Features

* bump version ([4ed7163](https://github.com/SUI-Components/sui/commit/4ed7163f674d67f8b7d68b7c0a4fc3786bac2267))



# 3.8.0 (2019-10-23)


### Features

* allow chaining decorators ([681c1f1](https://github.com/SUI-Components/sui/commit/681c1f193f61860003f1a4119812d194ca1b57de))
* remove not needed parameters ([984d03f](https://github.com/SUI-Components/sui/commit/984d03f91f5e874f18478fbb0f3fcad8f05c9b20))
* Update README and improve it a bit ([2694271](https://github.com/SUI-Components/sui/commit/2694271730616721b43bc4c7dbdcadb6d4f783fd))
* Upgrade tiny-lru dependency ([f5b8567](https://github.com/SUI-Components/sui/commit/f5b8567ea44264e66c60c039860f68bbefccedad))
* use new import from tiny-lru ([99271c8](https://github.com/SUI-Components/sui/commit/99271c8cd4623c96ceb7dd2fe0ca9da5498c969a))



# 3.7.0 (2019-09-10)


### Features

* added apply and its parameters to the original function ([e8f135f](https://github.com/SUI-Components/sui/commit/e8f135f95c39dff82da9c71b5124e09165a2b132))
* allow to disable the cache via __SUI_CACHE_DISABLED__ ([72c5176](https://github.com/SUI-Components/sui/commit/72c51762264253cc99f2edad6947caf0f1856985))
* check if global exist ([e887f84](https://github.com/SUI-Components/sui/commit/e887f842f9f2e88fafc3891a7738031d306dcbff))



# 3.6.0 (2019-05-20)


### Features

* update sui-js dependencie ([0ef872a](https://github.com/SUI-Components/sui/commit/0ef872a2384b6fd2053c1fd2428374937c1870e7))



# 3.5.0 (2019-04-30)


### Bug Fixes

* allow decorate an func with inlineError and Streamify at once ([0b72205](https://github.com/SUI-Components/sui/commit/0b722057dcd6a8354bd922f6948845d36c243868))



# 3.4.0 (2019-04-11)


### Bug Fixes

* streamify and inlineError are good friend again ([d3b444f](https://github.com/SUI-Components/sui/commit/d3b444f34b0b01dc883ed7e36fd34a94b2cae014))



# 3.3.0 (2019-03-18)


### Bug Fixes

* Release library with correct babel-preset-sui installed ([529a405](https://github.com/SUI-Components/sui/commit/529a4058c321e2d02984d92a68a5af1d57210d3a))



# 3.2.0 (2019-03-18)


### Features

* Move to babel-preset-sui@3 ([9df3814](https://github.com/SUI-Components/sui/commit/9df38142feca4355326ebb2ad289ad1b2f31f69c))



# 3.1.0 (2019-02-20)


### Bug Fixes

* use sinon 2 for test so is compatible with new sui-test ([4478c77](https://github.com/SUI-Components/sui/commit/4478c77d791fb1f0f53d2ceca1c9a8257f1b59e3))



# 7.0.0 (2019-02-19)


### Bug Fixes

* fix release version ([f443343](https://github.com/SUI-Components/sui/commit/f443343be7cd912b172a3a5256a9fb43e3c5238d))


### Features

* remove LFU cache ([0c9a97c](https://github.com/SUI-Components/sui/commit/0c9a97c3be2426b2c3950cc73640927c0a4b58de))


### Performance Improvements

* use tiny-lru with 0 deps instead lru-cache ([5c564dc](https://github.com/SUI-Components/sui/commit/5c564dcb313af9e4330e249b8926ee2394b1357d))


### BREAKING CHANGES

* LFU cache will stop working after this, so update to use LRU cache only



# 2.0.0 (2019-02-12)


### Features

* add new Error decorator ([1b43581](https://github.com/SUI-Components/sui/commit/1b4358119cf37229191f460dcf3ec5b12e4a4c2f))
* add new Error decorator and change babel preset ([8ffb30e](https://github.com/SUI-Components/sui/commit/8ffb30e3483e289b82634ba9ccbb7fb7ad4af3cd))


### BREAKING CHANGES

* Using new Babel Preset so new sui-bundler is needed
* Using new babel preset so only can be used with latest sui-bundler



# 1.10.0 (2019-02-12)


### Bug Fixes

* force releaese without new babel version ([77b00ce](https://github.com/SUI-Components/sui/commit/77b00ced66b524fb2eb948db5a12e1dace2f5e66))



# 1.9.0 (2019-02-11)


### Features

* added auth system to our express build. ([52cfb66](https://github.com/SUI-Components/sui/commit/52cfb6638c42afdddd707d39abb87697ea8ed712))
* create new decorator Error ([3923344](https://github.com/SUI-Components/sui/commit/39233447e997fc3bab16e31e8c9023269bd2512e))
* rename decorator de \[@inline](https://github.com/inline)Error ([867cfef](https://github.com/SUI-Components/sui/commit/867cfef950f2b535b61ef9593db52e8f160539e5))



# 1.8.0 (2018-06-05)


### Features

* remove cache tracking functionality ([054a0da](https://github.com/SUI-Components/sui/commit/054a0da31245312eb76f956f448605c63f999f2f))



# 1.7.0 (2018-03-15)


### Bug Fixes

* fix 2 tests until someone with the needed knowledge check what's happening ([a54392e](https://github.com/SUI-Components/sui/commit/a54392e4abc7a42ff443d7120fedb36ba29ced36))


### Features

* implement the remoteCDN on publicPath for chunking purposes. ([dab1a2e](https://github.com/SUI-Components/sui/commit/dab1a2edc84b7f86420abcd4b8f4da21580c608b)), closes [#228](https://github.com/SUI-Components/sui/issues/228)



# 1.6.0 (2018-03-05)


### Features

* clean testing packages and config on specific package ([96424aa](https://github.com/SUI-Components/sui/commit/96424aa746aefeb9a5932c5ca84d766bfd9f344e))



# 1.5.0 (2018-01-12)


### Features

* use new md5 sui-js library in sui-decorators ([426d6f9](https://github.com/SUI-Components/sui/commit/426d6f95efd0157857b1d819d2f6e919acce0ae3))



# 1.4.0 (2017-11-14)


### Bug Fixes

* remove private from package.json ([768cc6b](https://github.com/SUI-Components/sui/commit/768cc6bea01a37d0c3c6dd38f556f03b3bcc4217))



# 1.3.0 (2017-11-07)


### Features

* move cv-decorators to sui-decorators ([25813dc](https://github.com/SUI-Components/sui/commit/25813dc8a4034db53023eaff98d7ca2261baafd2))



# 1.2.0 (2017-09-21)


### Features

* move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([1980877](https://github.com/SUI-Components/sui/commit/1980877f41c8ef3cdc4fbc4fb922ed8924932ff7))



# 1.1.0 (2017-08-02)


### Features

* add package.json ([63e3529](https://github.com/SUI-Components/sui/commit/63e35294cd033324ef4e1aa18b22f0857211c90f)), closes [#67](https://github.com/SUI-Components/sui/issues/67)



