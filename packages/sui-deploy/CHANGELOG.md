# Change Log

All notable changes to this project will be documented in this file.

<a name="2.11.0"></a>
# 2.11.0 (2019-03-19)


### Bug Fixes

* fix unsupported import from not compiled package ([c2eb5b0](https://github.com/SUI-Components/sui/commit/c2eb5b0))



<a name="2.9.0"></a>
# 2.9.0 (2018-10-17)



<a name="2.8.0"></a>
# 2.8.0 (2018-10-02)


### Features

* add readme improvement ([f01fb9a](https://github.com/SUI-Components/sui/commit/f01fb9a))
* added env vars option to NOW ([c1b98e0](https://github.com/SUI-Components/sui/commit/c1b98e0))



<a name="2.7.0"></a>
# 2.7.0 (2018-07-26)


### Bug Fixes

* don't try to alias when alias is present ([e780919](https://github.com/SUI-Components/sui/commit/e780919))



<a name="2.6.0"></a>
# 2.6.0 (2018-07-16)


### Bug Fixes

* fix deployments removal ([187b899](https://github.com/SUI-Components/sui/commit/187b899))



<a name="2.5.0"></a>
# 2.5.0 (2018-07-10)


### Bug Fixes

* always get deployments ordered by day desc ([6daa1e4](https://github.com/SUI-Components/sui/commit/6daa1e4))


### Features

* lazy loading of now CLI only on first deploy ([73573c0](https://github.com/SUI-Components/sui/commit/73573c0))



<a name="2.4.0"></a>
# 2.4.0 (2018-07-09)


### Bug Fixes

* use brach name in travis env ([87051ee](https://github.com/SUI-Components/sui/commit/87051ee))



<a name="2.3.0"></a>
# 2.3.0 (2018-07-09)


### Bug Fixes

* fix path for default public path ([396acf1](https://github.com/SUI-Components/sui/commit/396acf1))


### Features

* rename /lib to /src to avoid gitignore ([1c24853](https://github.com/SUI-Components/sui/commit/1c24853))



<a name="2.2.0"></a>
# 2.2.0 (2018-07-09)


### Bug Fixes

* add missing package to dependencies ([9e714f7](https://github.com/SUI-Components/sui/commit/9e714f7))
* fix serve version for spas ([2c0c542](https://github.com/SUI-Components/sui/commit/2c0c542))


### Features

* add deploy commands for folders (with docker) ([0055cfc](https://github.com/SUI-Components/sui/commit/0055cfc))



<a name="2.1.0"></a>
# 2.1.0 (2018-07-05)


### Bug Fixes

* force kebab case for deploy names ([ebb2411](https://github.com/SUI-Components/sui/commit/ebb2411))



<a name="2.0.0"></a>
# 2.0.0 (2018-05-22)


### Bug Fixes

* remove default command to spa ([49b3f36](https://github.com/SUI-Components/sui/commit/49b3f36))
* upgrade warning ([1ff8760](https://github.com/SUI-Components/sui/commit/1ff8760))


### Features

* add --branch option to deploy by branch ([d3e99fb](https://github.com/SUI-Components/sui/commit/d3e99fb))
* add auth option and make it mandatory ([0dfb760](https://github.com/SUI-Components/sui/commit/0dfb760))


### BREAKING CHANGES

* Now deploys need either '--auth' or '--public' option to work. Otherwise an error is thrown



<a name="1.6.0"></a>
# 1.6.0 (2017-09-21)


### Features

* move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([7c4b207](https://github.com/SUI-Components/sui/commit/7c4b207))



<a name="1.5.0"></a>
# 1.5.0 (2017-09-13)


### Bug Fixes

* avoid race conditions for deployments aliases ([a1fd9fd](https://github.com/SUI-Components/sui/commit/a1fd9fd))



<a name="1.4.0"></a>
# 1.4.0 (2017-09-13)


### Features

* rename to [@s-ui](https://github.com/s-ui)/deploy ([d0cfab4](https://github.com/SUI-Components/sui/commit/d0cfab4))



<a name="1.3.0"></a>
# 1.3.0 (2017-09-13)


### Bug Fixes

* fix: version of sui-helpers too old ([408c623](https://github.com/SUI-Components/sui/commit/408c623))



<a name="1.2.0"></a>
# 1.2.0 (2017-09-13)


### Features

* prepare CLI api tu future targets ([96311ed](https://github.com/SUI-Components/sui/commit/96311ed))



<a name="1.1.0"></a>
# 1.1.0 (2017-09-13)


### Features

* "sui-deploy spa" command to deploy SPAs ([b3aa044](https://github.com/SUI-Components/sui/commit/b3aa044))



