# Change Log

All notable changes to this project will be documented in this file.

<a name="2.4.0"></a>
# 2.4.0 (2019-02-14)


### Bug Fixes

* update load message ([119495b](https://github.com/SUI-Components/sui/commit/119495b))



<a name="2.3.0"></a>
# 2.3.0 (2019-01-22)


### Bug Fixes

* add some improvements ([8335a3a](https://github.com/SUI-Components/sui/commit/8335a3a))
* avoid to define empty array ([45820d5](https://github.com/SUI-Components/sui/commit/45820d5))
* use normal function instead of arrow function ([4f76645](https://github.com/SUI-Components/sui/commit/4f76645))


### Features

* allow to add a blacklist of reg exps ([cd38682](https://github.com/SUI-Components/sui/commit/cd38682))



<a name="2.2.0"></a>
# 2.2.0 (2019-01-03)


### Bug Fixes

* change the way the config is loaded ([3fb04d2](https://github.com/SUI-Components/sui/commit/3fb04d2))



<a name="2.1.0"></a>
# 2.1.0 (2019-01-03)


### Bug Fixes

* add serial build error handling ([e31d6f7](https://github.com/SUI-Components/sui/commit/e31d6f7))



<a name="2.0.0"></a>
# 2.0.0 (2018-12-18)


### Bug Fixes

* avoid forcing config and make it optional ([10d3290](https://github.com/SUI-Components/sui/commit/10d3290))
* by default, aim all the pages if no regExp is provided ([7d23a7a](https://github.com/SUI-Components/sui/commit/7d23a7a))
* fix blank space ([14d1fb0](https://github.com/SUI-Components/sui/commit/14d1fb0))
* fix missing phrase ([ab3bb64](https://github.com/SUI-Components/sui/commit/ab3bb64))
* fix templates to generate widgets ([41cc665](https://github.com/SUI-Components/sui/commit/41cc665))
* fix typo ([dd0bafd](https://github.com/SUI-Components/sui/commit/dd0bafd))
* fix wrong comment for CLI ([a5013ea](https://github.com/SUI-Components/sui/commit/a5013ea))
* more resilient removing of plugin and reuse functionality ([fc2b9d7](https://github.com/SUI-Components/sui/commit/fc2b9d7))


### Features

* add address parameter ([07bfe40](https://github.com/SUI-Components/sui/commit/07bfe40))
* remove not needed packages ([e769ce9](https://github.com/SUI-Components/sui/commit/e769ce9))
* remove proxy functionality ([2566af0](https://github.com/SUI-Components/sui/commit/2566af0))
* show better console output to use widgets and fix no config ([af7b8d1](https://github.com/SUI-Components/sui/commit/af7b8d1))
* use new pages folder instead widgets ([930c648](https://github.com/SUI-Components/sui/commit/930c648))
* use pages instead widgets folder name ([3cb0b98](https://github.com/SUI-Components/sui/commit/3cb0b98))


### BREAKING CHANGES

* Now, the expected folder is pages instead widgets, as the widgets are inside pages.
* Proxy functionality removed to simplify development process and lifecycle



<a name="1.26.0"></a>
# 1.26.0 (2018-12-12)


### Bug Fixes

* set unique jsonpFunction to avoid collisions ([0b33d8e](https://github.com/SUI-Components/sui/commit/0b33d8e))



<a name="1.25.0"></a>
# 1.25.0 (2018-12-05)


### Bug Fixes

* disable zindex optimization on cssnano ([d5edd36](https://github.com/SUI-Components/sui/commit/d5edd36))



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
# 1.18.0 (2018-10-31)



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



