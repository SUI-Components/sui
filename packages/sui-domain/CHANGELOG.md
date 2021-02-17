# CHANGELOG

# 2.2.0 (2021-01-27)


### Bug Fixes

* unsubscribe correctly and update listeners ([a8d6f1e](https://github.com/SUI-Components/sui/commit/a8d6f1e30b469d25bfecab5ec5a23e3c5ec85091))


### Features

* subscribe to domain Use Case without decorators ([5738c96](https://github.com/SUI-Components/sui/commit/5738c9660d0bf0dd9a23fab2b421f98607056e9f))



# 2.1.0 (2020-12-01)


### Bug Fixes

* avoid transforming with Babel to avoid problems with sui-test ([d893bc4](https://github.com/SUI-Components/sui/commit/d893bc496988794721000cf06b2bf56b46bb7310))
* disable line for linter ([5341db8](https://github.com/SUI-Components/sui/commit/5341db8dba1c2ea5f4abaa9246e3099b3f400256))



# 2.0.0 (2020-06-16)



# 1.22.0 (2020-06-15)


### Features

* support single factory for useCase ([c2aa834](https://github.com/SUI-Components/sui/commit/c2aa834ffedeacf3e843114709b9b20169fb53f6))


### Performance Improvements

* use typescript interfaces to avoid javascript code ([285c909](https://github.com/SUI-Components/sui/commit/285c909cd0d87a79d6e3b128b65579c9e6ebdcd4))


### BREAKING CHANGES

* Yes, as it doesn't support not dynamic import for single useCases factories. We're not using it but,
just in case, we must use a major for this and be sure we're able to use this only when intended.



# 1.21.0 (2020-05-13)


### Features

* use latest axios version with bug fixes ([f20ad0a](https://github.com/SUI-Components/sui/commit/f20ad0a07321def5430e083c0d2a04a9f43455e7))



# 1.20.0 (2020-03-03)


### Bug Fixes

* fix typo ([f9d55a7](https://github.com/SUI-Components/sui/commit/f9d55a7d54fd385ffe2773f88ed1f3feaa95e435))
* make subscribe method take onNext, onError arguments ([f6f4e48](https://github.com/SUI-Components/sui/commit/f6f4e48b9d33aa2bb768d70ba992b86c893b3cca))



# 1.19.0 (2019-10-16)


### Features

* add patch verb to fetchert ([20f9935](https://github.com/SUI-Components/sui/commit/20f99356868b2c00fec305bba7dfca986c399a1a))



# 1.18.0 (2019-06-03)


### Features

* Upgrade axios ([3f401f4](https://github.com/SUI-Components/sui/commit/3f401f453823e5a3120c93bd7ea83454f5b93c3d))



# 1.17.0 (2019-03-25)



# 1.16.0 (2019-03-18)


### Bug Fixes

* Release library with correct babel-preset-sui installed ([be9486f](https://github.com/SUI-Components/sui/commit/be9486f12e339c4aa10811b5c6862865249da286))



# 1.15.0 (2019-03-18)


### Features

* Move to babel-preset-sui@3 ([84a3a57](https://github.com/SUI-Components/sui/commit/84a3a5773ce0c1b730b258f374a62a922b0802bb))



# 1.14.0 (2019-03-13)


### Bug Fixes

* avoid using not supported export from webpack ([566abb5](https://github.com/SUI-Components/sui/commit/566abb566d3b99cf385472cd51edc713a2b2a8c3))



# 1.13.0 (2019-02-19)


### Bug Fixes

* rollback babel dependencies for sui-domain ([5ad5604](https://github.com/SUI-Components/sui/commit/5ad56045a369836f7fcb2c3ddca1348ca9578636))
* Use local babel-preset-sui for each project ([4e2bd76](https://github.com/SUI-Components/sui/commit/4e2bd76a24651aebcb4e68eb63547537ef6f306b))



# 1.12.0 (2018-07-16)


### Features

* add options parameter to delete method ([0d7a286](https://github.com/SUI-Components/sui/commit/0d7a2861b8fbd85f128289d61b73899bcc0cfbd7))



# 1.11.0 (2018-06-27)


### Bug Fixes

* fix: anemic models toJSON not recursive ([d8dc699](https://github.com/SUI-Components/sui/commit/d8dc699017f745d4f59fb7d521cfa5f0682874bb))



# 1.10.0 (2018-04-17)


### Bug Fixes

* just check if the instanceof is an Array ([2197e24](https://github.com/SUI-Components/sui/commit/2197e24e4249c4499452f33305def1dea0760458))


### Features

* return different things depending on how are we loading useCases ([a8e6919](https://github.com/SUI-Components/sui/commit/a8e6919e35d291cd145df0a8d3c4d9c1ab3f42d6))



# 1.9.0 (2018-03-01)


### Bug Fixes

* make use of provided config in fetcher ([7bd2a62](https://github.com/SUI-Components/sui/commit/7bd2a623f0e9e1a9ec4a7a7bbcdecce9e7d10b4d))



# 1.8.0 (2018-01-26)


### Features

* created anemicModel to avoid unuseful code on our entities and valueobject ([c1ce9dc](https://github.com/SUI-Components/sui/commit/c1ce9dcb3f77be615f28626f9a3c1ae1b1cef4ce))



# 1.7.0 (2017-12-05)


### Features

* make config instatiable and mutable ([dda7d94](https://github.com/SUI-Components/sui/commit/dda7d945f9dd004c8829b6bcf7bc9bc3a2c8c676))



# 1.6.0 (2017-12-04)


### Bug Fixes

* force new package version for sui-domain ([671d80b](https://github.com/SUI-Components/sui/commit/671d80bb1bea3161b3610099e904ac81e27d3f1a))



# 1.4.0 (2017-12-04)


### Features

* add config as param for all useCases ([bf1b97a](https://github.com/SUI-Components/sui/commit/bf1b97a7b517ed3a6fdd97a5b0f6f905df1e70c5))



# 1.3.0 (2017-12-01)


### Bug Fixes

* fix being able to instantiate domain outside the domain package ([7d42e00](https://github.com/SUI-Components/sui/commit/7d42e006f20f1539e1d7161519b17ecff56ce266))



# 1.2.0 (2017-11-30)


### Bug Fixes

* fix wrong main directory on package.json ([e47ce16](https://github.com/SUI-Components/sui/commit/e47ce1684926cdfb635a75f63832d63dfac9687b))



# 1.1.0 (2017-11-30)


### Bug Fixes

* re-release package ([bcf905a](https://github.com/SUI-Components/sui/commit/bcf905a166e569396d60024b79783e941b5a3e16))



# 0.1.0 (2017-11-30)


### Features

* create sui-domain package ([15e1124](https://github.com/SUI-Components/sui/commit/15e1124b150ce123e9ecab081e9981e683705a40))
* handle all feedback ([a4fba8a](https://github.com/SUI-Components/sui/commit/a4fba8ac64b1d1799cd5a084d7a8d1baf591b2ec))



