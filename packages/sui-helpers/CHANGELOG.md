# CHANGELOG

# 1.31.0 (2021-02-16)


### Bug Fixes

* make node 12 friendly ([0b4a48f](https://github.com/SUI-Components/sui/commit/0b4a48f8fbc88e731f3229936435c6aa61f409e6))



# 1.30.0 (2021-02-01)


### Features

* improve installation time of lazy packages ([22f7688](https://github.com/SUI-Components/sui/commit/22f7688e981ac5970775db232c118b2aed87ea44))



# 1.29.0 (2020-12-30)


### Bug Fixes

* Do not catch error for getSpawnPromise ([d454a15](https://github.com/SUI-Components/sui/commit/d454a15bb6bf151263854f2e447f11743bf28430))



# 1.28.0 (2020-12-30)


### Features

* Use latest and same commander version and avoid installing different versions ([4b72fa9](https://github.com/SUI-Components/sui/commit/4b72fa96b048512f9b90c99409140adc27db5a5e))



# 1.27.0 (2020-12-11)


### Features

* more verbose errors ([92469c2](https://github.com/SUI-Components/sui/commit/92469c2776856da040a9275fafd39ac46a32cd5e))



# 1.26.0 (2020-12-11)


### Bug Fixes

* use correct exec options correctly ([69601df](https://github.com/SUI-Components/sui/commit/69601df4e2c5099c85b01b7bc34c7ab713babe97))



# 1.25.0 (2020-12-10)


### Bug Fixes

* fix tests ([61fa92a](https://github.com/SUI-Components/sui/commit/61fa92ae4856065aff65245661cd3705dfe1e23c))
* use correct package version ([98b96c6](https://github.com/SUI-Components/sui/commit/98b96c67976ecda74ae1a291ce1bf525c918419e))


### Features

* add colors helper and avoid external dependency ([0386376](https://github.com/SUI-Components/sui/commit/0386376f2b567b22c4f9710d19c32fb2eac4c91b))
* avoid using readline to avoid blocking read stdin ([d7db9a1](https://github.com/SUI-Components/sui/commit/d7db9a12ec39465dadc61d9ddca35452d9db2110))
* remove not needed dependencies and upgrade execa ([6aadc7d](https://github.com/SUI-Components/sui/commit/6aadc7d9cca5a54687896784dc3dd8de08af5fef))
* remove Windows support and simplify file ([9b1b38a](https://github.com/SUI-Components/sui/commit/9b1b38a04bc3ac27ddd5c6629092083a04324cdf))
* use new colors helper ([51c03f6](https://github.com/SUI-Components/sui/commit/51c03f65ef0b185bc8f8c835c39f8e97f4f68183))



# 1.24.0 (2020-12-03)


### Features

* use more execa and avoid spawn ([b777e6f](https://github.com/SUI-Components/sui/commit/b777e6f31e7fa847f91d84a65d005261c652e814))



# 1.23.0 (2020-12-03)


### Bug Fixes

* add some logging ([479e91e](https://github.com/SUI-Components/sui/commit/479e91e4505eba9b6dcf87edd52e504a27d2c67b))



# 1.22.0 (2020-12-03)


### Bug Fixes

* return CODE OK ([3cfab9d](https://github.com/SUI-Components/sui/commit/3cfab9d09763b6889f3519157f3b93e1f06ce19c))



# 1.21.0 (2020-12-03)


### Bug Fixes

* add missing dependency ([9d27200](https://github.com/SUI-Components/sui/commit/9d27200146eba8aa8878023f4ca19daa5cb3708f))



# 1.20.0 (2020-12-03)


### Features

* improve logging and output info ([6ea408d](https://github.com/SUI-Components/sui/commit/6ea408d8017b1d6337beb4e1c1506dc10afad0c7))
* remove figures and remove another dependency ([954df81](https://github.com/SUI-Components/sui/commit/954df81c876ddc96ff69081ad4b4bc02e6cc5dd9))
* remove not needed code used on sui-mono link ([e4eb240](https://github.com/SUI-Components/sui/commit/e4eb2401af2ca0748ba3664d684dc74cef7e8f8a))
* removing listR and logUpdate dependencies ([4feba3e](https://github.com/SUI-Components/sui/commit/4feba3efa762db56fcac66b3d1e649be97d59b8b))



# 1.19.0 (2020-10-23)



# 1.18.0 (2020-10-01)


### Features

* upgrade dependencies ([3fad76b](https://github.com/SUI-Components/sui/commit/3fad76b6da088e38739b27889dfa27cfbcf7bec0))



# 1.17.0 (2019-03-13)


### Features

* upgrade dependency listr that fixes problem with peer dependency ([4db231b](https://github.com/SUI-Components/sui/commit/4db231b032590a46bb4ff6100784f32e2c55d62b))



# 1.16.0 (2019-02-19)


### Bug Fixes

* improve Error msg ([9a60223](https://github.com/SUI-Components/sui/commit/9a602234ec0fa2e54f2f2ba82a6e505436d31fdd))


### Features

* send args to error msg ([42271cc](https://github.com/SUI-Components/sui/commit/42271cc15085a5ca9ae2bd7ae3c7e3cfd546363e))



# 1.15.0 (2018-07-10)


### Bug Fixes

* avoid npm@5 ti modify package.json on lazy installs ([619db04](https://github.com/SUI-Components/sui/commit/619db04b293d7f8812eb387dfe933fa14cf97991))
* show laszy install as info, not warning ([8ed1e8c](https://github.com/SUI-Components/sui/commit/8ed1e8cf44c7e7d1708c8d48a4d538cfc018ef84))


### Features

* add utility for lazy package bin loading ([fe03bbe](https://github.com/SUI-Components/sui/commit/fe03bbeed92d66b300a321d2859a64caf09ccacb))



# 1.14.0 (2018-06-25)


### Features

* add cache disable option for package.json retrievle ([a557fa8](https://github.com/SUI-Components/sui/commit/a557fa8a4361148acb10c1fc4f19765be6ecc42a))



# 1.13.0 (2018-05-31)


### Bug Fixes

* spawn with node only in windows ([f9f1170](https://github.com/SUI-Components/sui/commit/f9f1170d3145c79fc0ade7c3be8edfba4492ae83))



# 1.12.0 (2018-05-30)



# 1.11.0 (2018-05-30)


### Bug Fixes

* make cli helpers to work in windows ([373277f](https://github.com/SUI-Components/sui/commit/373277f7b9e333cde6fee69c0e20c3d0079c9ea5))


### Features

* don't log cli messages when output is set to 'ignore' ([60ca69d](https://github.com/SUI-Components/sui/commit/60ca69d3c20b92d1ca24681fb09424d101a6c8a4))



# 1.10.0 (2018-05-22)



# 1.9.0 (2018-05-17)


### Bug Fixes

* execute node scripts as node for windows cmd execution ([2de741d](https://github.com/SUI-Components/sui/commit/2de741d0295c0d642c17a54b1e41b04bfc319909))
* revert use of cross-spawn ([ad94899](https://github.com/SUI-Components/sui/commit/ad94899b312097b2ca957f6b7f78a33eb583eb05))


### Features

* better solution for cross-spawn. Use the same as execa ([b26ee1a](https://github.com/SUI-Components/sui/commit/b26ee1a999c41c48df13a30c536d650ce92c6660))
* make commands to work in windows in spawnList too ([c4e03a1](https://github.com/SUI-Components/sui/commit/c4e03a121b4673757b20f76ae46e19a90139fc01))
* showWarning helper for CLIs ([39c5368](https://github.com/SUI-Components/sui/commit/39c536831f5f8b58cecb0cb832d0088a79742e8c))



# 1.8.0 (2018-04-25)


### Features

* add default chunks number to spawnlist ([27398ec](https://github.com/SUI-Components/sui/commit/27398ec634b251b9ab8b47e0e52b62f7adbc5f0f))
* remove dep filter getInternalDependencyMap ([2439ada](https://github.com/SUI-Components/sui/commit/2439ada2b17e594e32c93d4fabe93870e97d8d05))



# 1.7.0 (2018-04-04)


### Features

* improve parallelSpawn output ([0321974](https://github.com/SUI-Components/sui/commit/03219745cf9d72009c80cd0d15a2271d0f1bf9bc))



# 1.6.0 (2018-02-14)


### Bug Fixes

* added local commander to keep retrocompatibility working ([04d5447](https://github.com/SUI-Components/sui/commit/04d5447610585d8d38b6794d36359806cd5ec9d7))
* fixed bug related to colors prototype inheritance by instance and comander differe ([2bb23d3](https://github.com/SUI-Components/sui/commit/2bb23d3077fc905ac6ba0823b78ff63f3b3136a7))
* fixed linting error ([001c171](https://github.com/SUI-Components/sui/commit/001c1715b49ef4cdb332a3764228f30a17bbbb72))



# 1.5.0 (2017-09-21)


### Bug Fixes

* fix to work on node v6 enironments ([98fd4c4](https://github.com/SUI-Components/sui/commit/98fd4c4148c320715199e7c6f1f7881d66239364))



# 1.4.0 (2017-09-21)


### Features

* Move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([af765a4](https://github.com/SUI-Components/sui/commit/af765a450b6b1e02ccd6b231dce901d01f8b7cad))



# 1.3.0 (2017-09-13)


### Features

* add helper to display errors when command fails ([23b7d9d](https://github.com/SUI-Components/sui/commit/23b7d9d75de65bfb04fda3121527d8307b4e0ac8))
* add helpers for file management ([1e69854](https://github.com/SUI-Components/sui/commit/1e69854189ab6b4b5dd42d4b1de668a91d1b9b81))
* add method to run commands in parallel ([02ea05e](https://github.com/SUI-Components/sui/commit/02ea05e657a5be5f2b09dab2ffa07f5991b97223))



# 1.2.0 (2017-07-04)


### Features

* add helpers to manage packages of file system ([b8ced10](https://github.com/SUI-Components/sui/commit/b8ced100e66254c14a70cbaeee5efd44888efc95))
* new package with cli helpers ([e270fa0](https://github.com/SUI-Components/sui/commit/e270fa05e48d5b3b97f5408914989a978585f733))



