# CHANGELOG

# 2.16.0 (2021-11-11)


### Features

* **packages/sui-pde:** add first iteration of experiment and feature components ([391d655](https://github.com/SUI-Components/sui/commit/391d655459dcb96a61f5b4b7c295ad3c22bd8df2))
* **packages/sui-pde:** apply destructoring review ([da66fc3](https://github.com/SUI-Components/sui/commit/da66fc3a0e086167ad47da427d9aca07450aec0f))
* **packages/sui-pde:** fix given reviews ([b074190](https://github.com/SUI-Components/sui/commit/b0741905f37ef0699c2efbfc238dbc1a3556d295))



# 2.15.0 (2021-10-08)


### Features

* **packages/sui-pde:** add cache for tracking events so its only send on update ([0cf6c26](https://github.com/SUI-Components/sui/commit/0cf6c26fdc926784c3d8f7fe984bc9ba0887b645))
* **packages/sui-pde:** migrate cache to functions ([3d8a9d4](https://github.com/SUI-Components/sui/commit/3d8a9d4e79a1aec33f4a2283105102e28d926d86))
* **packages/sui-pde:** reuse cache name string in tests ([7c4cabc](https://github.com/SUI-Components/sui/commit/7c4cabc853de9b55aa86653b360ed4263a383aba))
* **packages/sui-pde:** use session storage + file renaming ([4d77a5a](https://github.com/SUI-Components/sui/commit/4d77a5a8f6e2f56f24af9c261f08ca5a958de9e7))



# 2.14.0 (2021-09-28)


### Bug Fixes

* **packages/sui-pde:** isFeatureEnabled pass by application attributes ([4bfc251](https://github.com/SUI-Components/sui/commit/4bfc251f86dabb4d37c0feadae6bdf3263551fc7))


### Features

* **packages/sui-pde:** removing not needed clean step ([d180026](https://github.com/SUI-Components/sui/commit/d18002668105e44baccab6e23413bc5bf115a442))



# 2.13.0 (2021-08-17)


### Features

* **packages/sui-pde:** Remove errors on initializing Optimizely ([2416372](https://github.com/SUI-Components/sui/commit/24163723a34262714fbe43ea1e1b4c6b2b8c3f52))
* **packages/sui-pde:** Support unknown userId for feature enabled method ([084d3de](https://github.com/SUI-Components/sui/commit/084d3dea44e03b0a828b8450a738a15971868881))



# 2.12.0 (2021-08-13)


### Features

* **packages/sui-pde:** force feature ssr support ([10f9b2f](https://github.com/SUI-Components/sui/commit/10f9b2f9f6d8d488da537555378cf49a6d3f3d5f))



# 2.11.0 (2021-07-27)


### Features

* **packages/sui-pde:** fix scope ([9580db5](https://github.com/SUI-Components/sui/commit/9580db5128a678867841a7a51f0f3d98523be7f9))
* **packages/sui-pde:** track feature flags and feature tests ([0e09997](https://github.com/SUI-Components/sui/commit/0e09997a3e1a3c299e0958cd4c4e5cdccd11aa7e))
* **Root:** Use single @s-ui/test across packages ([1d8b926](https://github.com/SUI-Components/sui/commit/1d8b926e727cab44d599767ee13076bc451663bc))



# 2.10.0 (2021-06-04)


### Features

* **packages/sui-pde:** add feature variables support ([f9a29cc](https://github.com/SUI-Components/sui/commit/f9a29cc1584db3ffe3b720de10a3c8f5d8d8fd48))



# 2.9.0 (2021-06-02)


### Bug Fixes

* **packages/sui-pde:** Add already tracked outside the ready ([b7b7d78](https://github.com/SUI-Components/sui/commit/b7b7d7866a170ead18c13ae9f7a6c7feedd52080))



# 2.8.0 (2021-06-02)


### Features

* **packages/sui-pde:** Track experiment viewed only once ([19b320a](https://github.com/SUI-Components/sui/commit/19b320afd910cb421c9afb6871f4b15052b9a37e))



# 2.7.0 (2021-05-13)


### Features

* **packages/sui-pde:** avoid re downloading datafile on client when context has info ([007c3e8](https://github.com/SUI-Components/sui/commit/007c3e843a27b1c39f3d99a088d38aad0890fbc0))



# 2.6.0 (2021-04-30)


### Bug Fixes

* **packages/sui-pde:** fix error message on useFeature hook ([30e81bb](https://github.com/SUI-Components/sui/commit/30e81bb36469758565b66edd85b025073e90b2cc))



# 2.5.0 (2021-04-27)


### Features

* **packages/sui-pde:** implement isFeatureEnabled ([9b92140](https://github.com/SUI-Components/sui/commit/9b921406c56fa657240ad803cafd937f451976ff))



# 2.4.0 (2021-04-19)


### Features

* **packages/sui-pde:** force test and flag value ([467f528](https://github.com/SUI-Components/sui/commit/467f5283a68a9e5db1c4812eda31230411bd5135))
* **packages/sui-pde:** make the tests pass ([db88c8e](https://github.com/SUI-Components/sui/commit/db88c8e51c986d2a78d9d1de0fe9aeee4b6eeb95))



# 2.3.0 (2021-04-09)


### Bug Fixes

* **packages/sui-pde:** wait for tracking lib to be ready ([4063f5b](https://github.com/SUI-Components/sui/commit/4063f5b34279832916a655e3553346191c72e11f))



# 2.2.0 (2021-04-08)


### Features

* **packages/sui-pde:** global attributes to be always used ([671a5f1](https://github.com/SUI-Components/sui/commit/671a5f17412cae4f2a1188a17301c1f3eb704e1a))



# 2.1.0 (2021-03-31)


### Features

* **packages/sui-pde:** increase optimizely sdk version ([7424c81](https://github.com/SUI-Components/sui/commit/7424c814e09b5eb8fa2f85c15da5b077f8087ad2))



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



