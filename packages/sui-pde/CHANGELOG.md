# CHANGELOG

# 2.0.0 (2021-03-22)


### Bug Fixes

* **packages/sui-pde:** fix param name trackExperimentViewed ([6d890a0](https://github.com/SUI-Components/sui/commit/6d890a055f0e767c970ddd6ba079b611ec6ed1f2))
* **packages/sui-pde:** getEnabledFeatures returns an array not a promise ([47a754c](https://github.com/SUI-Components/sui/commit/47a754c84a86a27c07690168bf69232d2fe4c7ae))


### Features

* **packages/sui-pde:** add custom track to useExperiment ([81c8f8f](https://github.com/SUI-Components/sui/commit/81c8f8f28296ea58b9128961aba8da98f7d4fc10))


### BREAKING CHANGES

* **packages/sui-pde:** useExperiment now uses named parameters



# 1.6.0 (2021-03-16)


### Features

* **packages/sui-pde:** added different strategies for server/client hook execution ([b3cbc07](https://github.com/SUI-Components/sui/commit/b3cbc07fb08831599a973b9af034ad7864dcf9ff))
* **packages/sui-pde:** launch experiment viewed event ([03bba5c](https://github.com/SUI-Components/sui/commit/03bba5c4c7e9daf4473d9ad45e8c2dfe4beb95d0))



# 1.5.0 (2021-03-10)


### Features

* **packages/sui-pde:** fix old tests ([7ebd634](https://github.com/SUI-Components/sui/commit/7ebd634eb39ae6ffa0a2cb10d8b56e342c6cddc8))
* **packages/sui-pde:** refactor + updateConsents methods ([cfa5f56](https://github.com/SUI-Components/sui/commit/cfa5f562785be3e4ee2e3a8cfd8bcd592059015e))
* **packages/sui-pde:** update features to load via pde context ([ce2e37d](https://github.com/SUI-Components/sui/commit/ce2e37d5e93885014b06266a90475e83119e7f6f))



# 1.4.0 (2021-03-01)


### Features

* **packages/sui-pde:** add getVariation ([4894ec5](https://github.com/SUI-Components/sui/commit/4894ec5de69238128832e236451a6ac8cf87b34e))
* **packages/sui-pde:** default adapter returns null ([821a9a1](https://github.com/SUI-Components/sui/commit/821a9a14ad14282e79b2b5a5a496f44f955dd224))



# 1.3.0 (2021-02-22)


### Features

* **packages/sui-pde:** null instead of default and increase update interval ([e831aad](https://github.com/SUI-Components/sui/commit/e831aadec8623e774596d4871c58d96346416f24))



# 1.2.0 (2021-02-09)


### Features

* **sui-pde:** create getInitialData method ([090201d](https://github.com/SUI-Components/sui/commit/090201dc13a2b61924fd11ed85a7c29369533074))
* **sui-pde:** ignore console.error linter error ([a07f00d](https://github.com/SUI-Components/sui/commit/a07f00d4c984b7ce30dbeb712e9feccd0ec0188e))
* **sui-pde:** load initial datafile + test ([e8f2f18](https://github.com/SUI-Components/sui/commit/e8f2f18c12c7cd0c46217e515b4a939045483139))
* **sui-pde:** rename fn and load initial datafile from window ([0011818](https://github.com/SUI-Components/sui/commit/0011818c58c52b721c76a4100f3ce9a6cf16289e))
* **sui-pde:** rename getInitialContextData to getInitialData ([cfbf071](https://github.com/SUI-Components/sui/commit/cfbf071801c876442bb4099a32b7feb249f8519f))



# 1.1.0 (2021-02-03)


### Bug Fixes

* **sui-pde:** remove trackExperiment callback as tracking should be done via segment ([7d64c3e](https://github.com/SUI-Components/sui/commit/7d64c3ea733ca6cfbf76ede824869f6a42381ceb))
* **sui-pde:** rollback needed dependency ([d534dbc](https://github.com/SUI-Components/sui/commit/d534dbcde92f04a01f8de297cf48f6f8ee7327bb))
* **sui-pde:** use babel-preset-sui for transpiling ([2fc5153](https://github.com/SUI-Components/sui/commit/2fc51532341756e1c1df68c6ca970d57ac6da194))
* **sui-pde:** use correct main file ([10aaa2e](https://github.com/SUI-Components/sui/commit/10aaa2e6738712600352988614eb81f7a683e66f))


### Features

* **sui-pde:** add experimentation features ([d0538a2](https://github.com/SUI-Components/sui/commit/d0538a26bc595751d8d4653f929be4b7f0189c86))
* **sui-pde:** add hasUserConsent flag ([50971d5](https://github.com/SUI-Components/sui/commit/50971d59ed4969ca85d3fb8dce39b4761ca593c2))
* **sui-pde:** add optimizely track experiment callback ([6c3ba9d](https://github.com/SUI-Components/sui/commit/6c3ba9ded937ae1c482f8a12115e0e9a9e501d2a))
* **sui-pde:** add segment integration ([21a14f7](https://github.com/SUI-Components/sui/commit/21a14f7d77dbf5ebad8f581b7e743eb627e928d9))
* **sui-pde:** create sui-pde package ([a257a18](https://github.com/SUI-Components/sui/commit/a257a184ed49e557ae1e3b5f0b9a97ea1bced064))
* **sui-pde:** default experiment when no userId ([bfe601a](https://github.com/SUI-Components/sui/commit/bfe601abe376e7ebee2b49ba28b1d59bdc3f8b51))
* **sui-pde:** don't export Optimizely adapter ([0eb4f25](https://github.com/SUI-Components/sui/commit/0eb4f258d57541deef0d1b19b243413f42b20168))
* **sui-pde:** improvide hook error message ([401bd3b](https://github.com/SUI-Components/sui/commit/401bd3bd970f41333d5529592c72592445c672b8))
* **sui-pde:** merge options param and default options ([7b281dd](https://github.com/SUI-Components/sui/commit/7b281dd207b5ed8cce84ff92ff63c21d4e42d9f5))
* **sui-pde:** pass by instance options and activate attributes ([fe7c93a](https://github.com/SUI-Components/sui/commit/fe7c93a811469a1e1946bf61023334dee5e8fe3e))
* **sui-pde:** remove not existing hook + improve docu ([ea78506](https://github.com/SUI-Components/sui/commit/ea78506e7588bce75631acf5c327b49646ec1a7c))
* **sui-pde:** rename options to attributes ([f266acb](https://github.com/SUI-Components/sui/commit/f266acbf52e0a71fed5288d80f9e3c3f2dd2ba74))
* **sui-pde:** update docs and remove not needed dep ([8d9f36a](https://github.com/SUI-Components/sui/commit/8d9f36a5af3f48d77dd88cf7a82c7a8c280a8a10))
* **sui-pde:** update version and deps ([40577ec](https://github.com/SUI-Components/sui/commit/40577ec4c286b042327565776e1293224c82b774))
* **sui-pde:** use correct main file ([2cb6b53](https://github.com/SUI-Components/sui/commit/2cb6b53b6283b96dbcd8fe37b72fcc68067bba35))
* **sui-pde:** use hasUser fn instead of isActivated ([ef9ac85](https://github.com/SUI-Components/sui/commit/ef9ac858acd1e825a49a9e23792b56c69fc7e527))
* **sui-pde:** use pdeContext instead only feature ([55f2926](https://github.com/SUI-Components/sui/commit/55f29263b78b6aed78922684e166b6ce6fef30cb))
* **sui-pde:** variation default on optimizely error ([6382e8a](https://github.com/SUI-Components/sui/commit/6382e8a9390b4ff1db1f5e0c22bf3ac9aca87e63))



