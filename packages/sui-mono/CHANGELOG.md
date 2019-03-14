# Change Log

All notable changes to this project will be documented in this file.

<a name="1.41.0"></a>
# 1.41.0 (2019-03-14)


### Bug Fixes

* avoid creating Root scope path because it doesnt exist ([7524b3f](https://github.com/SUI-Components/sui/commit/7524b3f))


### Features

* let rootScope to be avoided even when root files are present ([6949402](https://github.com/SUI-Components/sui/commit/6949402))



<a name="1.40.0"></a>
# 1.40.0 (2019-01-18)


### Features

* check branch master is active when releasing a package ([e65aaaa](https://github.com/SUI-Components/sui/commit/e65aaaa))



<a name="1.39.0"></a>
# 1.39.0 (2018-11-29)


### Features

* add root scope check for monopackages ([d8c802d](https://github.com/SUI-Components/sui/commit/d8c802d))



<a name="1.38.0"></a>
# 1.38.0 (2018-09-06)


### Bug Fixes

* update commitizen to force warnings display ([de1d815](https://github.com/SUI-Components/sui/commit/de1d815))



<a name="1.37.0"></a>
# 1.37.0 (2018-08-31)


### Features

* phoenix with --no-progress output ([00b0bfd](https://github.com/SUI-Components/sui/commit/00b0bfd))



<a name="1.36.0"></a>
# 1.36.0 (2018-07-13)


### Features

* add scope instead of category/name and add scope option ([f947262](https://github.com/SUI-Components/sui/commit/f947262))
* release single package only ([cedff2c](https://github.com/SUI-Components/sui/commit/cedff2c)), closes [#152](https://github.com/SUI-Components/sui/issues/152)



<a name="1.35.0"></a>
# 1.35.0 (2018-06-26)


### Features

* add npm 6 support for phoenix ([31b3c7f](https://github.com/SUI-Components/sui/commit/31b3c7f))



<a name="1.34.0"></a>
# 1.34.0 (2018-06-25)


### Bug Fixes

* avoid relase commits to be different in windows ([b1df7eb](https://github.com/SUI-Components/sui/commit/b1df7eb))
* fix wrong release messages in windows ([1fbb54d](https://github.com/SUI-Components/sui/commit/1fbb54d))



<a name="1.33.0"></a>
# 1.33.0 (2018-06-20)


### Bug Fixes

* make releases work in windows ([9e837c1](https://github.com/SUI-Components/sui/commit/9e837c1))



<a name="1.32.0"></a>
# 1.32.0 (2018-05-31)


### Bug Fixes

* don't execute chunks when not needed ([1348e44](https://github.com/SUI-Components/sui/commit/1348e44))


### Features

* phoenix execution by chunks ([7a8761e](https://github.com/SUI-Components/sui/commit/7a8761e))



<a name="1.31.0"></a>
# 1.31.0 (2018-05-30)



<a name="1.30.0"></a>
# 1.30.0 (2018-05-30)


### Bug Fixes

* arrange paths for windows ([8467388](https://github.com/SUI-Components/sui/commit/8467388))


### Features

* command sui-mono phoenix ([9715c59](https://github.com/SUI-Components/sui/commit/9715c59))



<a name="1.29.0"></a>
# 1.29.0 (2018-04-30)


### Features

* better error handling when no files staged for commiting ([0157d0f](https://github.com/SUI-Components/sui/commit/0157d0f))



<a name="1.28.0"></a>
# 1.28.0 (2018-04-25)


### Bug Fixes

* fix race condition of linking components betweeen each other ([8de265e](https://github.com/SUI-Components/sui/commit/8de265e))



<a name="1.27.0"></a>
# 1.27.0 (2018-02-28)


### Bug Fixes

* fixed a bug related with the imort of cz types on sui mono ([15b9b59](https://github.com/SUI-Components/sui/commit/15b9b59))



<a name="1.26.0"></a>
# 1.26.0 (2017-10-10)


### Features

* assign sui-cz@1 to get new features ([fb45595](https://github.com/SUI-Components/sui/commit/fb45595))



<a name="1.25.0"></a>
# 1.25.0 (2017-10-09)


### Features

* commit-all command ([4bf8429](https://github.com/SUI-Components/sui/commit/4bf8429))



<a name="1.24.0"></a>
# 1.24.0 (2017-09-21)


### Bug Fixes

* point to correct version of [@s-ui](https://github.com/s-ui)/cz ([27bd99f](https://github.com/SUI-Components/sui/commit/27bd99f))



<a name="1.23.0"></a>
# 1.23.0 (2017-09-21)


### Features

* Move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([90c97e6](https://github.com/SUI-Components/sui/commit/90c97e6))



<a name="1.22.0"></a>
# 1.22.0 (2017-09-13)


### Features

* new command sui-mono run-parallel ([589f955](https://github.com/SUI-Components/sui/commit/589f955))



<a name="1.21.0"></a>
# 1.21.0 (2017-08-30)


### Bug Fixes

* fix changelog to generate log in right context ([122cec5](https://github.com/SUI-Components/sui/commit/122cec5))
* fix: release not detected with overlapped commits in merges ([fa72601](https://github.com/SUI-Components/sui/commit/fa72601)), closes [#100](https://github.com/SUI-Components/sui/issues/100)



<a name="1.20.0"></a>
# 1.20.0 (2017-08-29)


### Bug Fixes

* fix error on sui-mono release ([69e553c](https://github.com/SUI-Components/sui/commit/69e553c))



<a name="1.19.0"></a>
# 1.19.0 (2017-08-23)


### Bug Fixes

* make changelog take into account monopackage repos ([4e6e1cb](https://github.com/SUI-Components/sui/commit/4e6e1cb)), closes [#27](https://github.com/SUI-Components/sui/issues/27)



<a name="1.18.0"></a>
# 1.18.0 (2017-08-22)


### Features

* add command to generate changelog in markdown format ([bb62c38](https://github.com/SUI-Components/sui/commit/bb62c38))
* update CHANGELOG.md as part of every release ([9a64254](https://github.com/SUI-Components/sui/commit/9a64254))



<a name="1.17.0"></a>
# 1.17.0 (2017-08-09)


### Bug Fixes

* push tags to the repo ([92a1a7c](https://github.com/SUI-Components/sui/commit/92a1a7c))



<a name="1.16.0"></a>
# 1.16.0 (2017-08-09)


### Bug Fixes

* add help command for check ([866a1a3](https://github.com/SUI-Components/sui/commit/866a1a3)), closes [#53](https://github.com/SUI-Components/sui/issues/53)
* add release command help ([ce61a89](https://github.com/SUI-Components/sui/commit/ce61a89)), closes [#53](https://github.com/SUI-Components/sui/issues/53)
* remove console.log left there, bad boy! ([6037ea8](https://github.com/SUI-Components/sui/commit/6037ea8))
* use git command instead the debugging one ([23030fe](https://github.com/SUI-Components/sui/commit/23030fe))


### Features

* add commands for link and run ([c774e23](https://github.com/SUI-Components/sui/commit/c774e23))
* tag releases ([bb75071](https://github.com/SUI-Components/sui/commit/bb75071)), closes [#68](https://github.com/SUI-Components/sui/issues/68)
* tag releases ([95d213b](https://github.com/SUI-Components/sui/commit/95d213b))



<a name="1.14.0"></a>
# 1.14.0 (2017-07-27)


### Bug Fixes

* fix condition for mono package ([2621031](https://github.com/SUI-Components/sui/commit/2621031))
* fix how scope commits are flatten ([a180d3c](https://github.com/SUI-Components/sui/commit/a180d3c))


### Features

* check and release working for mono package mono repo projects ([493fcc9](https://github.com/SUI-Components/sui/commit/493fcc9))
* if a package has no package.json the project is monopackage ([0f6276c](https://github.com/SUI-Components/sui/commit/0f6276c))



<a name="1.14.0"></a>
# 1.14.0 (2017-07-04)


### Features

* dont publish private packages ([55c35ce](https://github.com/SUI-Components/sui/commit/55c35ce)), closes [#37](https://github.com/SUI-Components/sui/issues/37)



<a name="1.13.0"></a>
# 1.13.0 (2017-07-04)


### Features

* sui-mono link command ([db9596a](https://github.com/SUI-Components/sui/commit/db9596a)), closes [#21](https://github.com/SUI-Components/sui/issues/21)



<a name="1.12.0"></a>
# 1.12.0 (2017-07-03)


### Bug Fixes

* fix to use default restrict access type instead private ([6a566a7](https://github.com/SUI-Components/sui/commit/6a566a7)), closes [#32](https://github.com/SUI-Components/sui/issues/32)



<a name="1.12.0"></a>
# 1.12.0 (2017-06-30)


### Bug Fixes

* version tag nos set properly ([fc740ff](https://github.com/SUI-Components/sui/commit/fc740ff)), closes [#3c00cec1d5e3138bf2095b70200b9e8d447f0de1](https://github.com/SUI-Components/sui/issues/3c00cec1d5e3138bf2095b70200b9e8d447f0de1)



<a name="1.10.0"></a>
# 1.10.0 (2017-06-29)


### Bug Fixes

* release version commit is empty ([3c00cec](https://github.com/SUI-Components/sui/commit/3c00cec))


### Features

* migrate commands executions to sui-helpers/cli ([e6341bf](https://github.com/SUI-Components/sui/commit/e6341bf))



<a name="1.8.0"></a>
# 1.8.0 (2017-06-25)


### Bug Fixes

* change release to avoid race conditions ([cb65029](https://github.com/SUI-Components/sui/commit/cb65029))



<a name="1.7.0"></a>
# 1.7.0 (2017-06-25)


### Features

* add "sui-mono run" for multiple executions ([c14b66c](https://github.com/SUI-Components/sui/commit/c14b66c))



<a name="1.6.0"></a>
# 1.6.0 (2017-06-22)


### Features

* add config by CLI options ([3bec4ef](https://github.com/SUI-Components/sui/commit/3bec4ef))



<a name="1.5.0"></a>
# 1.5.0 (2017-06-21)


### Bug Fixes

* remove unused scripts ([d7dd39b](https://github.com/SUI-Components/sui/commit/d7dd39b))



<a name="1.4.0"></a>
# 1.4.0 (2017-06-21)


### Bug Fixes

* remove unused script phoenix ([3b2b249](https://github.com/SUI-Components/sui/commit/3b2b249))



<a name="1.3.0"></a>
# 1.3.0 (2017-06-21)


### Bug Fixes

* not throw error on release if build script is absent ([f8d91dc](https://github.com/SUI-Components/sui/commit/f8d91dc)), closes [#13](https://github.com/SUI-Components/sui/issues/13)



<a name="1.2.0"></a>
# 1.2.0 (2017-06-21)


### Bug Fixes

* fix refactor error. packageConfig has no config prop ([d2312a3](https://github.com/SUI-Components/sui/commit/d2312a3))



<a name="1.1.0"></a>
# 1.1.0 (2017-06-16)


### Bug Fixes

* add build script which is mandatory ([8ce1de8](https://github.com/SUI-Components/sui/commit/8ce1de8))
* move build script to scripts, instead of bin ([baa86d0](https://github.com/SUI-Components/sui/commit/baa86d0))
* sui-mono/src/types does not work ([2f73f25](https://github.com/SUI-Components/sui/commit/2f73f25))
* switch use of cz-crm to sui-cz ([9036614](https://github.com/SUI-Components/sui/commit/9036614))


### Features

* set package name to [@schibstedspain](https://github.com/schibstedspain)/sui-mono ([98255d4](https://github.com/SUI-Components/sui/commit/98255d4))



