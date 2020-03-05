# Change Log

All notable changes to this project will be documented in this file.

# 1.48.0 (2020-01-17)


### Features

* set current installed packages log ([617f0a8](https://github.com/SUI-Components/sui/commit/617f0a8c938281ba8b9270a4b3efd6bbd8e0c94a))



# 1.47.0 (2020-01-03)


### Bug Fixes

* program options are strings, force chunk as number before execute p-queue command ([2b0ebfe](https://github.com/SUI-Components/sui/commit/2b0ebfe590de036f78c740481a1904b0deb8d1f5))



# 1.46.0 (2019-12-20)


### Bug Fixes

* add needed scripts flag ([300830c](https://github.com/SUI-Components/sui/commit/300830c1792d3b44cab8a266ee600cfedd07ed48))
* remove bin-links flag that's breaking some deployments ([8822812](https://github.com/SUI-Components/sui/commit/882281212b8c88289ea9cac05fb79565e98bc977))


### Features

* add new --ci flag focused on ci installs with fixes and optimizations ([cc2252e](https://github.com/SUI-Components/sui/commit/cc2252e84cbd3b8191320b66a40a9f78e0c9664b))
* dont show progress on ci ([abe55aa](https://github.com/SUI-Components/sui/commit/abe55aa5e6c94f592283704f7785870f25da02c7))
* install execa dependency ([d8b83c4](https://github.com/SUI-Components/sui/commit/d8b83c4836c7b771422b348b45e93a420140b6f5))



# 1.45.0 (2019-12-17)


### Features

* add no-root option and better logging ([ccf8950](https://github.com/SUI-Components/sui/commit/ccf8950320f85c702b9b0e98e9e2f20bcc354310))
* avoid downloading gif asset ([3df84a9](https://github.com/SUI-Components/sui/commit/3df84a94656e6410ff780678e90442abacbed3bc))
* change message to be more semantically clear and Adria is happy with me ([1c5cf0e](https://github.com/SUI-Components/sui/commit/1c5cf0e21f35b5f90be9b47de8c82803500076cc))
* remove not needed dependency ([e0a6275](https://github.com/SUI-Components/sui/commit/e0a627533591fc1a850a6178e71473f920cce1d9))
* show error message ([0f7834c](https://github.com/SUI-Components/sui/commit/0f7834c7c270a9db5bfeb852452ece8cae9506a3))
* simplify sui-mono phoenix ([2a085a3](https://github.com/SUI-Components/sui/commit/2a085a352d23e48fadf38f22befdafd3cf9333d2))
* use a less problematic concurrency ([2214341](https://github.com/SUI-Components/sui/commit/2214341f3a485c39ef66c70866eb27211a8fa0fd))



# 1.44.0 (2019-12-16)


### Features

* upgrade dependencies to stop using spawn-sync sub-dependency ([61f4d15](https://github.com/SUI-Components/sui/commit/61f4d151ae61d61c7ceb6f3f8a224bfc77225e37))



# 1.43.0 (2019-07-01)


### Features

* resolve promise after writing stream ends ([abbcc9e](https://github.com/SUI-Components/sui/commit/abbcc9e2e3a9ebda0209fb629e91ef6d0eec82ac))



# 1.42.0 (2019-06-11)


### Bug Fixes

* fix getChangelogFilename import ([b4d08c3](https://github.com/SUI-Components/sui/commit/b4d08c391cbe1d52beada75b31d92da7ef6ac3a1))


### Features

* add getter for changelog filename in config ([9c770a7](https://github.com/SUI-Components/sui/commit/9c770a7d5ae4c1835d7408e1fc964df7ce06de27))
* get changelog file name from config ([5c404a5](https://github.com/SUI-Components/sui/commit/5c404a5194a954b40a91d390dc240be6dbde5762))
* limit committed files to package.json and changelog.md ([88fd9dc](https://github.com/SUI-Components/sui/commit/88fd9dc3becc496622f866920ce837185d57f001))



# 1.41.0 (2019-03-14)


### Bug Fixes

* avoid creating Root scope path because it doesnt exist ([7524b3f](https://github.com/SUI-Components/sui/commit/7524b3fb8890e27143140bfe1c0657eeabbaeefe))


### Features

* let rootScope to be avoided even when root files are present ([6949402](https://github.com/SUI-Components/sui/commit/694940212cb47455561faeb2db366abf5ec0eba1))



# 1.40.0 (2019-01-18)


### Features

* check branch master is active when releasing a package ([e65aaaa](https://github.com/SUI-Components/sui/commit/e65aaaa892b997e29d700fc961492a953d749e82))



# 1.39.0 (2018-11-29)


### Features

* add root scope check for monopackages ([d8c802d](https://github.com/SUI-Components/sui/commit/d8c802d18f8ef40de85d38f0103211e2ad4106a1))



# 1.38.0 (2018-09-06)


### Bug Fixes

* update commitizen to force warnings display ([de1d815](https://github.com/SUI-Components/sui/commit/de1d815fa314c231487abfb37bd4f3a5c5365b15))



# 1.37.0 (2018-08-31)


### Features

* phoenix with --no-progress output ([00b0bfd](https://github.com/SUI-Components/sui/commit/00b0bfd85c9a84fb61f19fb1959457af0895899a))



# 1.36.0 (2018-07-13)


### Features

* add scope instead of category/name and add scope option ([f947262](https://github.com/SUI-Components/sui/commit/f947262c0e421c6ad2344edc24d45e8da831edfb))
* release single package only ([cedff2c](https://github.com/SUI-Components/sui/commit/cedff2c7efccdb1b10b958d2bddb2698bb611efc)), closes [#152](https://github.com/SUI-Components/sui/issues/152)



# 1.35.0 (2018-06-26)


### Features

* add npm 6 support for phoenix ([31b3c7f](https://github.com/SUI-Components/sui/commit/31b3c7f54677745b274d7d3e9397a9296997da6f))



# 1.34.0 (2018-06-25)


### Bug Fixes

* avoid relase commits to be different in windows ([b1df7eb](https://github.com/SUI-Components/sui/commit/b1df7eb872a2f522377a6dac3cdad2f70cef7183))
* fix wrong release messages in windows ([1fbb54d](https://github.com/SUI-Components/sui/commit/1fbb54d07c8c2b8f94407dd0f2a27b07e0cf53cd))



# 1.33.0 (2018-06-20)


### Bug Fixes

* make releases work in windows ([9e837c1](https://github.com/SUI-Components/sui/commit/9e837c19fd7082b877532482130034a5cff7cbec))



# 1.32.0 (2018-05-31)


### Bug Fixes

* don't execute chunks when not needed ([1348e44](https://github.com/SUI-Components/sui/commit/1348e449a80c40bef1ef8f4c8c2ac9b32ae27a3a))


### Features

* phoenix execution by chunks ([7a8761e](https://github.com/SUI-Components/sui/commit/7a8761e4b30b7ed35996bafcdad4cf9d0af379cc))



# 1.31.0 (2018-05-30)



# 1.30.0 (2018-05-30)


### Bug Fixes

* arrange paths for windows ([8467388](https://github.com/SUI-Components/sui/commit/84673882224e8734d5c8dd7e1c4edcf9794b7199))


### Features

* command sui-mono phoenix ([9715c59](https://github.com/SUI-Components/sui/commit/9715c59100595e604f339c74bb0b7e3a1e8a5712))



# 1.29.0 (2018-04-30)


### Features

* better error handling when no files staged for commiting ([0157d0f](https://github.com/SUI-Components/sui/commit/0157d0f4a7385f65afb5765a30a72890bb04ab25))



# 1.28.0 (2018-04-25)


### Bug Fixes

* fix race condition of linking components betweeen each other ([8de265e](https://github.com/SUI-Components/sui/commit/8de265ecf6478078809d19084b2ae6ea96434597))



# 1.27.0 (2018-02-28)


### Bug Fixes

* fixed a bug related with the imort of cz types on sui mono ([15b9b59](https://github.com/SUI-Components/sui/commit/15b9b593f5cee560337bde086585b89d98d587a8))



# 1.26.0 (2017-10-10)


### Features

* assign sui-cz@1 to get new features ([fb45595](https://github.com/SUI-Components/sui/commit/fb455956ae57e506430c01913eeba438a11d0078))



# 1.25.0 (2017-10-09)


### Features

* commit-all command ([4bf8429](https://github.com/SUI-Components/sui/commit/4bf84290a0763d0dbe44563b7c2078222ce6f1a1))



# 1.24.0 (2017-09-21)


### Bug Fixes

* point to correct version of @s-ui/cz ([27bd99f](https://github.com/SUI-Components/sui/commit/27bd99f1a9274026349464c6b00da9dc7f7db5dc))



# 1.23.0 (2017-09-21)


### Features

* Move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([90c97e6](https://github.com/SUI-Components/sui/commit/90c97e61b5cbdd6036fb9994dcc9fb9c1714ea72))



# 1.22.0 (2017-09-13)


### Features

* new command sui-mono run-parallel ([589f955](https://github.com/SUI-Components/sui/commit/589f955e27e4a7da3c4a3152f654149987652d7e))



# 1.21.0 (2017-08-30)


### Bug Fixes

* fix changelog to generate log in right context ([122cec5](https://github.com/SUI-Components/sui/commit/122cec50bd1229b27a7262c70609278886637dce))
* fix: release not detected with overlapped commits in merges ([fa72601](https://github.com/SUI-Components/sui/commit/fa72601e2a5784ff8339bcb79561defa1e2ab944)), closes [#100](https://github.com/SUI-Components/sui/issues/100)



# 1.20.0 (2017-08-29)


### Bug Fixes

* fix error on sui-mono release ([69e553c](https://github.com/SUI-Components/sui/commit/69e553c8bde6105cf564675250794fc12d33ec2c))



# 1.19.0 (2017-08-23)


### Bug Fixes

* make changelog take into account monopackage repos ([4e6e1cb](https://github.com/SUI-Components/sui/commit/4e6e1cbefb192d543cfe51d394c7674806a4fe7b)), closes [#27](https://github.com/SUI-Components/sui/issues/27)



# 1.18.0 (2017-08-22)


### Features

* add command to generate changelog in markdown format ([bb62c38](https://github.com/SUI-Components/sui/commit/bb62c3830507adbd195e4fd0f9aa4ea038ec8d3b))
* update CHANGELOG.md as part of every release ([9a64254](https://github.com/SUI-Components/sui/commit/9a64254e85f45e6521467c50020be52ab133da44))



# 1.17.0 (2017-08-09)


### Bug Fixes

* push tags to the repo ([92a1a7c](https://github.com/SUI-Components/sui/commit/92a1a7c1aaff4f57a00dd982af53d66ffaee39a9))



# 1.16.0 (2017-08-09)


### Bug Fixes

* add help command for check ([866a1a3](https://github.com/SUI-Components/sui/commit/866a1a3c07732d11212a8cd6592c1b03e0d352b9)), closes [#53](https://github.com/SUI-Components/sui/issues/53)
* add release command help ([ce61a89](https://github.com/SUI-Components/sui/commit/ce61a8989747011981e094a1afbb7ae8f864346b)), closes [#53](https://github.com/SUI-Components/sui/issues/53)
* remove console.log left there, bad boy! ([6037ea8](https://github.com/SUI-Components/sui/commit/6037ea8026355cf9eb7b7262d88b39b946986231))
* use git command instead the debugging one ([23030fe](https://github.com/SUI-Components/sui/commit/23030fe9e09347e136e9a5de9b79912bfb296bcd))


### Features

* add commands for link and run ([c774e23](https://github.com/SUI-Components/sui/commit/c774e2334ee89bcaa249c802c34feb00228b9524))
* tag releases ([bb75071](https://github.com/SUI-Components/sui/commit/bb750710c9a9b32e0a38f742e6defb5c1f9ae335)), closes [#68](https://github.com/SUI-Components/sui/issues/68)
* tag releases ([95d213b](https://github.com/SUI-Components/sui/commit/95d213bab6095539c8431bceb12a7acee17eeec7))



# 1.14.0 (2017-07-27)


### Bug Fixes

* fix condition for mono package ([2621031](https://github.com/SUI-Components/sui/commit/26210311abafc651ad3263fc88944a5b698a6633))
* fix how scope commits are flatten ([a180d3c](https://github.com/SUI-Components/sui/commit/a180d3cdddbe18f36ed4bf11d0fea7140785f001))


### Features

* check and release working for mono package mono repo projects ([493fcc9](https://github.com/SUI-Components/sui/commit/493fcc9c53555499b64646aac16afa6601f6db21))
* if a package has no package.json the project is monopackage ([0f6276c](https://github.com/SUI-Components/sui/commit/0f6276c88b4695a1ae9be995c3b6dda97c05c17e))



# 1.14.0 (2017-07-04)


### Features

* dont publish private packages ([55c35ce](https://github.com/SUI-Components/sui/commit/55c35cefe9a504ea10259404f05ce53b04f87178)), closes [#37](https://github.com/SUI-Components/sui/issues/37)



# 1.13.0 (2017-07-04)


### Features

* sui-mono link command ([db9596a](https://github.com/SUI-Components/sui/commit/db9596ac372f0e10e2c321a7fb93649599cd4a1f)), closes [#21](https://github.com/SUI-Components/sui/issues/21)



# 1.12.0 (2017-07-03)


### Bug Fixes

* fix to use default restrict access type instead private ([6a566a7](https://github.com/SUI-Components/sui/commit/6a566a7b2be1b546a1ca22bc46f2e4b4e275bbff)), closes [#32](https://github.com/SUI-Components/sui/issues/32)



# 1.12.0 (2017-06-30)


### Bug Fixes

* version tag nos set properly ([fc740ff](https://github.com/SUI-Components/sui/commit/fc740fff97ea64ee14f38c72776d6e07e15f4b52)), closes [#3c00cec1d5e3138bf2095b70200b9e8d447f0de1](https://github.com/SUI-Components/sui/issues/3c00cec1d5e3138bf2095b70200b9e8d447f0de1)



# 1.10.0 (2017-06-29)


### Bug Fixes

* release version commit is empty ([3c00cec](https://github.com/SUI-Components/sui/commit/3c00cec1d5e3138bf2095b70200b9e8d447f0de1))


### Features

* migrate commands executions to sui-helpers/cli ([e6341bf](https://github.com/SUI-Components/sui/commit/e6341bf4a1395bc8fe048c6decbf80f6186aa272))



# 1.8.0 (2017-06-25)


### Bug Fixes

* change release to avoid race conditions ([cb65029](https://github.com/SUI-Components/sui/commit/cb650291fd76eb015a69e6c25be99f9d76eda4cc))



# 1.7.0 (2017-06-25)


### Features

* add "sui-mono run" for multiple executions ([c14b66c](https://github.com/SUI-Components/sui/commit/c14b66c5ea3893f5f28c28c7d06d003f20e8beff))


### Reverts

* Revert "feat(sui-mono): add config by CLI options" ([c7e019a](https://github.com/SUI-Components/sui/commit/c7e019ad8485ca5c7c75c2d92e1af8bed324b697))



# 1.6.0 (2017-06-22)


### Features

* add config by CLI options ([3bec4ef](https://github.com/SUI-Components/sui/commit/3bec4ef9dc3d133a7074c7cb83e8b600ef371d2a))



# 1.5.0 (2017-06-21)


### Bug Fixes

* remove unused scripts ([d7dd39b](https://github.com/SUI-Components/sui/commit/d7dd39b2099f2c7ce1b985f7ab84f4425d40a9e7))



# 1.4.0 (2017-06-21)


### Bug Fixes

* remove unused script phoenix ([3b2b249](https://github.com/SUI-Components/sui/commit/3b2b249cb164548b657a810920157d3c17664984))



# 1.3.0 (2017-06-21)


### Bug Fixes

* not throw error on release if build script is absent ([f8d91dc](https://github.com/SUI-Components/sui/commit/f8d91dc55b4398ab8afd8e3e2c7bcac5c1fb10ee)), closes [#13](https://github.com/SUI-Components/sui/issues/13)



# 1.2.0 (2017-06-21)


### Bug Fixes

* fix refactor error. packageConfig has no config prop ([d2312a3](https://github.com/SUI-Components/sui/commit/d2312a33584d5b92af4a728b3efba4592f30b0c5))



# 1.1.0 (2017-06-16)


### Bug Fixes

* add build script which is mandatory ([8ce1de8](https://github.com/SUI-Components/sui/commit/8ce1de881dd9a1b84394944957766bba5f551f53))
* move build script to scripts, instead of bin ([baa86d0](https://github.com/SUI-Components/sui/commit/baa86d064943ea5b2442adb9ad9b1c086a62090a))
* sui-mono/src/types does not work ([2f73f25](https://github.com/SUI-Components/sui/commit/2f73f25ffeb9b4f968d13f0359f1dcb192f91cca))
* switch use of cz-crm to sui-cz ([9036614](https://github.com/SUI-Components/sui/commit/903661465358c0bde8ca008f3f591bf79a1e8e07))


### Features

* set package name to @schibstedspain/sui-mono ([98255d4](https://github.com/SUI-Components/sui/commit/98255d47359bb932240b01b5d7bdded83654c6ba))



