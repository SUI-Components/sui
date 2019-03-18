# Change Log

All notable changes to this project will be documented in this file.

<a name="3.2.0"></a>
# 3.2.0 (2019-03-18)


### Features

* Move to babel-preset-sui@3 ([9df3814](https://github.com/SUI-Components/sui/commit/9df3814))



<a name="3.1.0"></a>
# 3.1.0 (2019-02-20)


### Bug Fixes

* use sinon 2 for test so is compatible with new sui-test ([4478c77](https://github.com/SUI-Components/sui/commit/4478c77))



<a name="7.0.0"></a>
# 7.0.0 (2019-02-19)


### Bug Fixes

* fix release version ([f443343](https://github.com/SUI-Components/sui/commit/f443343))


### Features

* remove LFU cache ([0c9a97c](https://github.com/SUI-Components/sui/commit/0c9a97c))


### Performance Improvements

* use tiny-lru with 0 deps instead lru-cache ([5c564dc](https://github.com/SUI-Components/sui/commit/5c564dc))


### BREAKING CHANGES

* LFU cache will stop working after this, so update to use LRU cache only



<a name="2.0.0"></a>
# 2.0.0 (2019-02-12)


### Features

* add new Error decorator ([1b43581](https://github.com/SUI-Components/sui/commit/1b43581))
* add new Error decorator and change babel preset ([8ffb30e](https://github.com/SUI-Components/sui/commit/8ffb30e))


### BREAKING CHANGES

* Using new Babel Preset so new sui-bundler is needed
* Using new babel preset so only can be used with latest sui-bundler



<a name="1.10.0"></a>
# 1.10.0 (2019-02-12)


### Bug Fixes

* force releaese without new babel version ([77b00ce](https://github.com/SUI-Components/sui/commit/77b00ce))



<a name="1.9.0"></a>
# 1.9.0 (2019-02-11)


### Features

* added auth system to our express build. ([52cfb66](https://github.com/SUI-Components/sui/commit/52cfb66))
* create new decorator Error ([3923344](https://github.com/SUI-Components/sui/commit/3923344))
* rename decorator de \[@inline](https://github.com/inline)Error ([867cfef](https://github.com/SUI-Components/sui/commit/867cfef))



<a name="1.8.0"></a>
# 1.8.0 (2018-06-05)


### Features

* remove cache tracking functionality ([054a0da](https://github.com/SUI-Components/sui/commit/054a0da))



<a name="1.7.0"></a>
# 1.7.0 (2018-03-15)


### Bug Fixes

* fix 2 tests until someone with the needed knowledge check what's happening ([a54392e](https://github.com/SUI-Components/sui/commit/a54392e))


### Features

* implement the remoteCDN on publicPath for chunking purposes. ([dab1a2e](https://github.com/SUI-Components/sui/commit/dab1a2e)), closes [#228](https://github.com/SUI-Components/sui/issues/228)



<a name="1.6.0"></a>
# 1.6.0 (2018-03-05)


### Features

* clean testing packages and config on specific package ([96424aa](https://github.com/SUI-Components/sui/commit/96424aa))



<a name="1.5.0"></a>
# 1.5.0 (2018-01-12)


### Features

* use new md5 sui-js library in sui-decorators ([426d6f9](https://github.com/SUI-Components/sui/commit/426d6f9))



<a name="1.4.0"></a>
# 1.4.0 (2017-11-14)


### Bug Fixes

* remove private from package.json ([768cc6b](https://github.com/SUI-Components/sui/commit/768cc6b))



<a name="1.3.0"></a>
# 1.3.0 (2017-11-07)


### Features

* move cv-decorators to sui-decorators ([25813dc](https://github.com/SUI-Components/sui/commit/25813dc))



<a name="1.2.0"></a>
# 1.2.0 (2017-09-21)


### Features

* move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([1980877](https://github.com/SUI-Components/sui/commit/1980877))



<a name="1.1.0"></a>
# 1.1.0 (2017-08-02)


### Features

* add package.json ([63e3529](https://github.com/SUI-Components/sui/commit/63e3529)), closes [#67](https://github.com/SUI-Components/sui/issues/67)



