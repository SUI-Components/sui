# CHANGELOG

# 1.39.0 (2024-05-06)


### Bug Fixes

* add some fixes ([f4fa3af](https://github.com/SUI-Components/sui/commit/f4fa3af2366897ee0aa72b469f9a6667d8c21822))


### Features

* Add dynamicPackage ([dbfded8](https://github.com/SUI-Components/sui/commit/dbfded8342e96add990b323337e54b1d34cd6a2b))
* add more support to typescript ([e8780da](https://github.com/SUI-Components/sui/commit/e8780da793f2c882c5da73bfe19d945c1a87f461))
* remove not needed function ([6db9f33](https://github.com/SUI-Components/sui/commit/6db9f33e0d6f9bcad657f9eda251946a91684995))
* Remove not optional from ci install for swc compatibility ([9e214aa](https://github.com/SUI-Components/sui/commit/9e214aa54c323139cd1ee5709289850e33e164dc))
* restore original versions ([0961a23](https://github.com/SUI-Components/sui/commit/0961a23642b3a5d34c5b5ff332f848e5dd40ccf4))



# 1.38.0 (2022-05-30)


### Features

* **packages/sui-helpers:** Upgrade dependencies across packages ([f4f7be1](https://github.com/SUI-Components/sui/commit/f4f7be197389cb86c9e221b4e1d98598a2eb9074))



# 1.37.0 (2022-03-08)


### Features

* **packages/sui-helpers:** Ugrade fs-extra dependency and use same in all packages ([49a2102](https://github.com/SUI-Components/sui/commit/49a2102516b80780e3613162e5ce6c46221bfc89))



# 1.36.0 (2021-11-29)


### Features

* **packages/sui-helpers:** Add types to colors method ([2707380](https://github.com/SUI-Components/sui/commit/2707380b515e5cff4f2369d19f6f78e2168c10af))



# 1.35.0 (2021-11-02)


### Features

* **packages/sui-helpers:** Move require package to the top ([5a6630a](https://github.com/SUI-Components/sui/commit/5a6630ae77b8fd4f4f4a4b2d5fc5425c3d4405ca))



# 1.34.0 (2021-10-25)


### Features

* **packages/sui-helpers:** Use readline instead process.stdout to clear lines ([0f8892e](https://github.com/SUI-Components/sui/commit/0f8892e7f1587df8cdca4d1543273188f96d9bf3))



# 1.33.0 (2021-09-22)


### Features

* **packages/sui-helpers:** Unify fs-extra dependency across packages ([aee6515](https://github.com/SUI-Components/sui/commit/aee6515f61696ead884659c59eccb098a41a682e))



# 1.32.0 (2021-03-30)


### Bug Fixes

* **packages/sui-helpers:** show commander help only if provided from param ([71943a7](https://github.com/SUI-Components/sui/commit/71943a7011494b324d938ff8b761f1051d3d3f13))



# 1.31.0 (2021-02-16)


### Bug Fixes

* **sui-helpers:** make node 12 friendly ([0b4a48f](https://github.com/SUI-Components/sui/commit/0b4a48f8fbc88e731f3229936435c6aa61f409e6))



# 1.30.0 (2021-02-01)


### Features

* **sui-helpers:** improve installation time of lazy packages ([22f7688](https://github.com/SUI-Components/sui/commit/22f7688e981ac5970775db232c118b2aed87ea44))



# 1.29.0 (2020-12-30)


### Bug Fixes

* **sui-helpers:** Do not catch error for getSpawnPromise ([d454a15](https://github.com/SUI-Components/sui/commit/d454a15bb6bf151263854f2e447f11743bf28430))



# 1.28.0 (2020-12-30)


### Features

* **sui-helpers:** Use latest and same commander version and avoid installing different versions ([4b72fa9](https://github.com/SUI-Components/sui/commit/4b72fa96b048512f9b90c99409140adc27db5a5e))



# 1.27.0 (2020-12-11)


### Features

* **sui-helpers:** more verbose errors ([92469c2](https://github.com/SUI-Components/sui/commit/92469c2776856da040a9275fafd39ac46a32cd5e))



# 1.26.0 (2020-12-11)


### Bug Fixes

* **sui-helpers:** use correct exec options correctly ([69601df](https://github.com/SUI-Components/sui/commit/69601df4e2c5099c85b01b7bc34c7ab713babe97))



# 1.25.0 (2020-12-10)


### Bug Fixes

* **sui-helpers:** fix tests ([61fa92a](https://github.com/SUI-Components/sui/commit/61fa92ae4856065aff65245661cd3705dfe1e23c))
* **sui-helpers:** use correct package version ([98b96c6](https://github.com/SUI-Components/sui/commit/98b96c67976ecda74ae1a291ce1bf525c918419e))


### Features

* **sui-helpers:** add colors helper and avoid external dependency ([0386376](https://github.com/SUI-Components/sui/commit/0386376f2b567b22c4f9710d19c32fb2eac4c91b))
* **sui-helpers:** avoid using readline to avoid blocking read stdin ([d7db9a1](https://github.com/SUI-Components/sui/commit/d7db9a12ec39465dadc61d9ddca35452d9db2110))
* **sui-helpers:** remove not needed dependencies and upgrade execa ([6aadc7d](https://github.com/SUI-Components/sui/commit/6aadc7d9cca5a54687896784dc3dd8de08af5fef))
* **sui-helpers:** remove Windows support and simplify file ([9b1b38a](https://github.com/SUI-Components/sui/commit/9b1b38a04bc3ac27ddd5c6629092083a04324cdf))
* **sui-helpers:** use new colors helper ([51c03f6](https://github.com/SUI-Components/sui/commit/51c03f65ef0b185bc8f8c835c39f8e97f4f68183))



# 1.24.0 (2020-12-03)


### Features

* **sui-helpers:** use more execa and avoid spawn ([b777e6f](https://github.com/SUI-Components/sui/commit/b777e6f31e7fa847f91d84a65d005261c652e814))



# 1.23.0 (2020-12-03)


### Bug Fixes

* **sui-helpers:** add some logging ([479e91e](https://github.com/SUI-Components/sui/commit/479e91e4505eba9b6dcf87edd52e504a27d2c67b))



# 1.22.0 (2020-12-03)


### Bug Fixes

* **sui-helpers:** return CODE OK ([3cfab9d](https://github.com/SUI-Components/sui/commit/3cfab9d09763b6889f3519157f3b93e1f06ce19c))



# 1.21.0 (2020-12-03)


### Bug Fixes

* **sui-helpers:** add missing dependency ([9d27200](https://github.com/SUI-Components/sui/commit/9d27200146eba8aa8878023f4ca19daa5cb3708f))



# 1.20.0 (2020-12-03)


### Features

* **sui-helpers:** remove figures and remove another dependency ([954df81](https://github.com/SUI-Components/sui/commit/954df81c876ddc96ff69081ad4b4bc02e6cc5dd9))
* **sui-helpers:** remove not needed code used on sui-mono link ([e4eb240](https://github.com/SUI-Components/sui/commit/e4eb2401af2ca0748ba3664d684dc74cef7e8f8a))
* **sui-helpers:** removing listR and logUpdate dependencies ([4feba3e](https://github.com/SUI-Components/sui/commit/4feba3efa762db56fcac66b3d1e649be97d59b8b))
* **sui-mono:** improve logging and output info ([6ea408d](https://github.com/SUI-Components/sui/commit/6ea408d8017b1d6337beb4e1c1506dc10afad0c7))



# 1.19.0 (2020-10-23)



# 1.18.0 (2020-10-01)


### Features

* **sui-helpers:** upgrade dependencies ([3fad76b](https://github.com/SUI-Components/sui/commit/3fad76b6da088e38739b27889dfa27cfbcf7bec0))



# 1.17.0 (2019-03-13)


### Features

* **sui-helpers:** upgrade dependency listr that fixes problem with peer dependency ([4db231b](https://github.com/SUI-Components/sui/commit/4db231b032590a46bb4ff6100784f32e2c55d62b))



# 1.16.0 (2019-02-19)


### Bug Fixes

* **sui-helpers:** improve Error msg ([9a60223](https://github.com/SUI-Components/sui/commit/9a602234ec0fa2e54f2f2ba82a6e505436d31fdd))


### Features

* **sui-helpers:** send args to error msg ([42271cc](https://github.com/SUI-Components/sui/commit/42271cc15085a5ca9ae2bd7ae3c7e3cfd546363e))



# 1.15.0 (2018-07-10)


### Bug Fixes

* **sui-helpers:** avoid npm@5 ti modify package.json on lazy installs ([619db04](https://github.com/SUI-Components/sui/commit/619db04b293d7f8812eb387dfe933fa14cf97991))
* **sui-helpers:** show laszy install as info, not warning ([8ed1e8c](https://github.com/SUI-Components/sui/commit/8ed1e8cf44c7e7d1708c8d48a4d538cfc018ef84))


### Features

* **sui-helpers:** add utility for lazy package bin loading ([fe03bbe](https://github.com/SUI-Components/sui/commit/fe03bbeed92d66b300a321d2859a64caf09ccacb))



# 1.14.0 (2018-06-25)


### Features

* **sui-helpers:** add cache disable option for package.json retrievle ([a557fa8](https://github.com/SUI-Components/sui/commit/a557fa8a4361148acb10c1fc4f19765be6ecc42a))



# 1.13.0 (2018-05-31)


### Bug Fixes

* **sui-helpers:** spawn with node only in windows ([f9f1170](https://github.com/SUI-Components/sui/commit/f9f1170d3145c79fc0ade7c3be8edfba4492ae83))



# 1.12.0 (2018-05-30)



# 1.11.0 (2018-05-30)


### Bug Fixes

* **sui-helpers:** make cli helpers to work in windows ([373277f](https://github.com/SUI-Components/sui/commit/373277f7b9e333cde6fee69c0e20c3d0079c9ea5))


### Features

* **sui-helpers:** don't log cli messages when output is set to 'ignore' ([60ca69d](https://github.com/SUI-Components/sui/commit/60ca69d3c20b92d1ca24681fb09424d101a6c8a4))



# 1.10.0 (2018-05-22)



# 1.9.0 (2018-05-17)


### Bug Fixes

* **sui-helpers:** execute node scripts as node for windows cmd execution ([2de741d](https://github.com/SUI-Components/sui/commit/2de741d0295c0d642c17a54b1e41b04bfc319909))
* **sui-helpers:** revert use of cross-spawn ([ad94899](https://github.com/SUI-Components/sui/commit/ad94899b312097b2ca957f6b7f78a33eb583eb05))


### Features

* **sui-helpers:** better solution for cross-spawn. Use the same as execa ([b26ee1a](https://github.com/SUI-Components/sui/commit/b26ee1a999c41c48df13a30c536d650ce92c6660))
* **sui-helpers:** make commands to work in windows in spawnList too ([c4e03a1](https://github.com/SUI-Components/sui/commit/c4e03a121b4673757b20f76ae46e19a90139fc01))
* **sui-helpers:** showWarning helper for CLIs ([39c5368](https://github.com/SUI-Components/sui/commit/39c536831f5f8b58cecb0cb832d0088a79742e8c))



# 1.8.0 (2018-04-25)


### Features

* **sui-helpers:** add default chunks number to spawnlist ([27398ec](https://github.com/SUI-Components/sui/commit/27398ec634b251b9ab8b47e0e52b62f7adbc5f0f))
* **sui-helpers:** remove dep filter getInternalDependencyMap ([2439ada](https://github.com/SUI-Components/sui/commit/2439ada2b17e594e32c93d4fabe93870e97d8d05))



# 1.7.0 (2018-04-04)


### Features

* **sui-helpers:** improve parallelSpawn output ([0321974](https://github.com/SUI-Components/sui/commit/03219745cf9d72009c80cd0d15a2271d0f1bf9bc))



# 1.6.0 (2018-02-14)


### Bug Fixes

* **sui-helpers:** added local commander to keep retrocompatibility working ([04d5447](https://github.com/SUI-Components/sui/commit/04d5447610585d8d38b6794d36359806cd5ec9d7))
* **sui-helpers:** fixed bug related to colors prototype inheritance by instance and comander differe ([2bb23d3](https://github.com/SUI-Components/sui/commit/2bb23d3077fc905ac6ba0823b78ff63f3b3136a7))
* **sui-helpers:** fixed linting error ([001c171](https://github.com/SUI-Components/sui/commit/001c1715b49ef4cdb332a3764228f30a17bbbb72))



# 1.5.0 (2017-09-21)


### Bug Fixes

* **sui-helpers:** fix to work on node v6 enironments ([98fd4c4](https://github.com/SUI-Components/sui/commit/98fd4c4148c320715199e7c6f1f7881d66239364))



# 1.4.0 (2017-09-21)


### Features

* **sui-helpers:** Move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([af765a4](https://github.com/SUI-Components/sui/commit/af765a450b6b1e02ccd6b231dce901d01f8b7cad))



# 1.3.0 (2017-09-13)


### Features

* **sui-bundler:** add method to run commands in parallel ([02ea05e](https://github.com/SUI-Components/sui/commit/02ea05e657a5be5f2b09dab2ffa07f5991b97223))
* **sui-helpers:** add helper to display errors when command fails ([23b7d9d](https://github.com/SUI-Components/sui/commit/23b7d9d75de65bfb04fda3121527d8307b4e0ac8))
* **sui-helpers:** add helpers for file management ([1e69854](https://github.com/SUI-Components/sui/commit/1e69854189ab6b4b5dd42d4b1de668a91d1b9b81))



# 1.2.0 (2017-07-04)


### Features

* **sui-helpers:** add helpers to manage packages of file system ([b8ced10](https://github.com/SUI-Components/sui/commit/b8ced100e66254c14a70cbaeee5efd44888efc95))
* **sui-helpers:** new package with cli helpers ([e270fa0](https://github.com/SUI-Components/sui/commit/e270fa05e48d5b3b97f5408914989a978585f733))