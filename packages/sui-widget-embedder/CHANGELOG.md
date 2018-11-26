# Change Log

All notable changes to this project will be documented in this file.

<a name="1.24.0"></a>
# 1.24.0 (2018-11-19)


### Bug Fixes

* remove undefined vendor from webpack's config ([1040d4c](https://github.com/SUI-Components/sui/commit/1040d4c))



<a name="1.19.0"></a>
# 1.19.0 (2018-11-15)


### Bug Fixes

* update files to load ([2586020](https://github.com/SUI-Components/sui/commit/2586020))


### Features

* update entry point to always be app ([7c688b2](https://github.com/SUI-Components/sui/commit/7c688b2))



<a name="1.18.0"></a>
# [1.18.0](https://github.com/SUI-Components/sui/compare/1.12.0...1.18.0) (2018-10-31)



<a name="1.17.0"></a>
# 1.17.0 (2018-10-31)


### Features

* update bundler version and remove webpack dependency ([79c8077](https://github.com/SUI-Components/sui/commit/79c8077))



<a name="1.16.0"></a>
# 1.16.0 (2018-10-25)


### Bug Fixes

* update bundler version in order to avoid multiple webpack runtimes collisi ([975e0df](https://github.com/SUI-Components/sui/commit/975e0df))



<a name="1.15.0"></a>
# 1.15.0 (2018-10-03)


### Bug Fixes

* add ending slash to path ([c136698](https://github.com/SUI-Components/sui/commit/c136698))
* added CORS header for dev server ([e3bdbed](https://github.com/SUI-Components/sui/commit/e3bdbed))


### Features

* update dev widget server path ([c8f3836](https://github.com/SUI-Components/sui/commit/c8f3836))



<a name="1.14.0"></a>
# 1.14.0 (2018-03-15)


### Bug Fixes

* ad a / on the remoteCDN publicPath to avoid import errors ([985d742](https://github.com/SUI-Components/sui/commit/985d742))



<a name="1.13.0"></a>
# 1.13.0 (2018-03-15)


### Features

* implement the remoteCDN on publicPath for chunking purposes. ([dab1a2e](https://github.com/SUI-Components/sui/commit/dab1a2e)), closes [#228](https://github.com/SUI-Components/sui/issues/228)



<a name="1.11.0"></a>
# 1.11.0 (2018-03-01)


### Bug Fixes

* fix lint errors ([0f25954](https://github.com/SUI-Components/sui/commit/0f25954))
* linting errors ([f0b7411](https://github.com/SUI-Components/sui/commit/f0b7411))


### Features

* add help texts, splitted file templates and added some explanations to th ([9102bae](https://github.com/SUI-Components/sui/commit/9102bae)), closes [#213](https://github.com/SUI-Components/sui/issues/213)
* added first file ([1f1085f](https://github.com/SUI-Components/sui/commit/1f1085f))
* added package-json modifier to add a new start script ([123a8a1](https://github.com/SUI-Components/sui/commit/123a8a1))
* added some docs to the readme ([9787d0f](https://github.com/SUI-Components/sui/commit/9787d0f))
* added sui widget embedder main file ([ef3b169](https://github.com/SUI-Components/sui/commit/ef3b169))
* core files created and tested successfully ([6ddd44a](https://github.com/SUI-Components/sui/commit/6ddd44a))
* created base generator code taking as an example the sui-studio-generate ([c0fbca7](https://github.com/SUI-Components/sui/commit/c0fbca7))
* pr changes, created const variable ([25f86e5](https://github.com/SUI-Components/sui/commit/25f86e5))



<a name="1.10.0"></a>
# 1.10.0 (2018-02-15)


### Features

* enforcin utf-8 enconding to dismiss encoding errors on some sites. ([5bd9a09](https://github.com/SUI-Components/sui/commit/5bd9a09))
* enforcin utf-8 enconding to dismiss encoding errors on some sites. ([c827d9d](https://github.com/SUI-Components/sui/commit/c827d9d))



<a name="1.9.0"></a>
# 1.9.0 (2018-02-14)


### Features

* added service worker cdn ([d329378](https://github.com/SUI-Components/sui/commit/d329378))
* changed fallback to remoteCDN instead to config.remotecdn ([65d7c9e](https://github.com/SUI-Components/sui/commit/65d7c9e))



<a name="1.8.0"></a>
# 1.8.0 (2017-12-22)


### Features

* added remoteCdn option on build command to allow us to add custom CDN url ([8134b1c](https://github.com/SUI-Components/sui/commit/8134b1c))



<a name="1.7.0"></a>
# 1.7.0 (2017-12-12)


### Features

* add sw to precache assets ([4b7909e](https://github.com/SUI-Components/sui/commit/4b7909e))



<a name="1.6.0"></a>
# 1.6.0 (2017-12-11)


### Bug Fixes

* downloader doesnt load in localhost ([b0209a9](https://github.com/SUI-Components/sui/commit/b0209a9))


### Features

* use several pages at the same time ([0f6ab67](https://github.com/SUI-Components/sui/commit/0f6ab67))



<a name="1.5.0"></a>
# 1.5.0 (2017-12-11)


### Features

* Changed innerHTML by appendChild to avoid selector childs to be rewritted and event ([c35a4d8](https://github.com/SUI-Components/sui/commit/c35a4d8))



<a name="1.4.0"></a>
# 1.4.0 (2017-11-29)


### Bug Fixes

* be able navigate from a login page ([bbac050](https://github.com/SUI-Components/sui/commit/bbac050))



<a name="1.3.0"></a>
# 1.3.0 (2017-11-03)


### Features

* pass a static pathname to the cli to avoid the reverse proxy ([0166111](https://github.com/SUI-Components/sui/commit/0166111))



<a name="1.2.0"></a>
# 1.2.0 (2017-10-24)


### Bug Fixes

* move [@s-ui](https://github.com/s-ui)/bundler to pro deps ([8c8cffc](https://github.com/SUI-Components/sui/commit/8c8cffc))



<a name="1.1.0"></a>
# 1.1.0 (2017-10-24)


### Bug Fixes

* apply PR comments ([ef9e955](https://github.com/SUI-Components/sui/commit/ef9e955))
* donwloader avoid load assets in localhost ([e1d5ca1](https://github.com/SUI-Components/sui/commit/e1d5ca1))
* fix css load ([019420e](https://github.com/SUI-Components/sui/commit/019420e))
* load assets only when there is a match ([5a38d47](https://github.com/SUI-Components/sui/commit/5a38d47))


### Features

* build all pages automagicaly ([daf3ddc](https://github.com/SUI-Components/sui/commit/daf3ddc))
* create donwloader.js with the manifests of the assets ([856eae3](https://github.com/SUI-Components/sui/commit/856eae3))
* created Widgets components ([2a929fd](https://github.com/SUI-Components/sui/commit/2a929fd))
* first commit ([447917f](https://github.com/SUI-Components/sui/commit/447917f))



