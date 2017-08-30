# Change Log

All notable changes to this project will be documented in this file.

<a name="1.21.0"></a>
# 1.21.0 (2017-08-30)


### Bug Fixes

* fix changelog to generate log in right context ([122cec5](https://github.com/SUI-Components/sui/commit/122cec5))
* fix: release not detected with overlapped commits in merges ([fa72601](https://github.com/SUI-Components/sui/commit/fa72601))



<a name="1.20.0"></a>
# 1.20.0 (2017-08-29)


### Bug Fixes

* fix error on sui-mono release ([69e553c](https://github.com/SUI-Components/sui/commit/69e553c))



<a name="1.19.0"></a>
# 1.19.0 (2017-08-23)


### Bug Fixes

* make changelog take into account monopackage repos ([4e6e1cb](https://github.com/SUI-Components/sui/commit/4e6e1cb))



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

* add help command for check ([866a1a3](https://github.com/SUI-Components/sui/commit/866a1a3))
* add release command help ([ce61a89](https://github.com/SUI-Components/sui/commit/ce61a89))
* remove console.log left there, bad boy! ([6037ea8](https://github.com/SUI-Components/sui/commit/6037ea8))
* use git command instead the debugging one ([23030fe](https://github.com/SUI-Components/sui/commit/23030fe))


### Features

* add commands for link and run ([c774e23](https://github.com/SUI-Components/sui/commit/c774e23))
* tag releases ([bb75071](https://github.com/SUI-Components/sui/commit/bb75071))
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

* dont publish private packages ([55c35ce](https://github.com/SUI-Components/sui/commit/55c35ce))



<a name="1.13.0"></a>
# 1.13.0 (2017-07-04)


### Features

* sui-mono link command ([db9596a](https://github.com/SUI-Components/sui/commit/db9596a))



<a name="1.12.0"></a>
# 1.12.0 (2017-07-03)


### Bug Fixes

* fix to use default restrict access type instead private ([6a566a7](https://github.com/SUI-Components/sui/commit/6a566a7))



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

* not throw error on release if build script is absent ([f8d91dc](https://github.com/SUI-Components/sui/commit/f8d91dc))



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



