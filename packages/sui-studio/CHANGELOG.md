# Change Log

All notable changes to this project will be documented in this file.

<a name="5.10.0"></a>
# 5.10.0 (2018-08-21)


### Bug Fixes

* fix warnings generate by the When component ([f739978](https://github.com/SUI-Components/sui/commit/f739978))



<a name="5.9.0"></a>
# 5.9.0 (2018-08-14)


### Bug Fixes

* unescape path separator in regex to avoid error importing demo page. ([5809e1d](https://github.com/SUI-Components/sui/commit/5809e1d))



<a name="5.8.0"></a>
# 5.8.0 (2018-08-08)


### Features

* allow create Entry Point to make a demo page ([64e9979](https://github.com/SUI-Components/sui/commit/64e9979))



<a name="5.7.0"></a>
# 5.7.0 (2018-08-06)


### Bug Fixes

* avoid compile error when there is not themes folder ([f216afd](https://github.com/SUI-Components/sui/commit/f216afd))
* preserve the resolver extesion config ([e10b6fd](https://github.com/SUI-Components/sui/commit/e10b6fd))


### Features

* bump beta version ([f15dc76](https://github.com/SUI-Components/sui/commit/f15dc76))
* contextify working component ([9a3bee3](https://github.com/SUI-Components/sui/commit/9a3bee3))
* create dev command ([d27de0a](https://github.com/SUI-Components/sui/commit/d27de0a))
* create LinkLoader to be used in the --link-all flag ([fbe7f0d](https://github.com/SUI-Components/sui/commit/fbe7f0d))
* first commit ([6b69575](https://github.com/SUI-Components/sui/commit/6b69575))
* improve workbench UI ([673ef5d](https://github.com/SUI-Components/sui/commit/673ef5d))
* use version 3 of sui-bundler ([881698c](https://github.com/SUI-Components/sui/commit/881698c))



<a name="5.6.0"></a>
# 5.6.0 (2018-06-25)


### Bug Fixes

* avoid importing not needed files on node_modules and improve bundle time ([e6d3534](https://github.com/SUI-Components/sui/commit/e6d3534))



<a name="5.5.0"></a>
# 5.5.0 (2018-06-20)


### Bug Fixes

* pass context to builder ([c75acf1](https://github.com/SUI-Components/sui/commit/c75acf1))
* prepare for windows ([8247260](https://github.com/SUI-Components/sui/commit/8247260))



<a name="5.4.0"></a>
# 5.4.0 (2018-05-30)


### Bug Fixes

* add require(path) where needed ([295bd9b](https://github.com/SUI-Components/sui/commit/295bd9b))
* make paths to work in windows ([b6bd8fe](https://github.com/SUI-Components/sui/commit/b6bd8fe))



<a name="5.3.0"></a>
# 5.3.0 (2018-05-03)


### Features

* move ReactDocGen to API component naming ([f82edfc](https://github.com/SUI-Components/sui/commit/f82edfc))
* use new tryRequire file to rule them all ([9464a70](https://github.com/SUI-Components/sui/commit/9464a70))


### Performance Improvements

* async loading of snarkdown as a chunk ([893ecef](https://github.com/SUI-Components/sui/commit/893ecef))



<a name="5.2.0"></a>
# 5.2.0 (2018-04-13)


### Bug Fixes

* rollback import context as it's causing to import wrong files ([e9247ca](https://github.com/SUI-Components/sui/commit/e9247ca))



<a name="5.1.0"></a>
# 5.1.0 (2018-04-12)


### Bug Fixes

* use new [@s-ui](https://github.com/s-ui)/bundler to make it work ([6a98a34](https://github.com/SUI-Components/sui/commit/6a98a34))



<a name="5.0.0"></a>
# 5.0.0 (2018-04-12)


### Bug Fixes

* add head and body elements to index.html ([8fc11e5](https://github.com/SUI-Components/sui/commit/8fc11e5))
* fix sui-studio to work with latest webpack version ([8081687](https://github.com/SUI-Components/sui/commit/8081687))


### Features

* get the context from export default instead module.exports ([832590f](https://github.com/SUI-Components/sui/commit/832590f))
* remove not used libraries, update codeMirror and load theme ([04b481a](https://github.com/SUI-Components/sui/commit/04b481a))
* remove not used right now module.hot ([0df0d1e](https://github.com/SUI-Components/sui/commit/0df0d1e))
* remove routes feature ([862fdda](https://github.com/SUI-Components/sui/commit/862fdda))
* remove undefined events for playground and sort code ([ea2358f](https://github.com/SUI-Components/sui/commit/ea2358f))
* use new dynamic import and remove old require.context ([8b881f3](https://github.com/SUI-Components/sui/commit/8b881f3))


### BREAKING CHANGES

* Removed routes support for playground
* Now context.js of studios should export default instead using module.exports



<a name="4.44.0"></a>
# 4.44.0 (2018-02-05)


### Features

* name chunk for reactdocgen ([425ed27](https://github.com/SUI-Components/sui/commit/425ed27))


### Performance Improvements

* load chunk of React Doc Gen only when needed ([e191517](https://github.com/SUI-Components/sui/commit/e191517))



<a name="4.43.0"></a>
# 4.43.0 (2018-02-02)


### Bug Fixes

* fix released package version for studio ([79bd317](https://github.com/SUI-Components/sui/commit/79bd317))
* fix wrong releasse for sui-studio ([2abb541](https://github.com/SUI-Components/sui/commit/2abb541))



<a name="4.42.0"></a>
# 4.42.0 (2018-02-01)


### Features

* add babel-polyfill from cdn as well ([a2a9de1](https://github.com/SUI-Components/sui/commit/a2a9de1))
* use babel-polyfill instead [@s-ui](https://github.com/s-ui)/polyfill for supporting IE11 ([13ae558](https://github.com/SUI-Components/sui/commit/13ae558))


### Performance Improvements

* preloadd babel-polyfill ([f9cdab5](https://github.com/SUI-Components/sui/commit/f9cdab5))



<a name="4.41.0"></a>
# 4.41.0 (2018-01-26)


### Performance Improvements

* use babel-standalone from cdn instead as package dependency ([2c2dc9d](https://github.com/SUI-Components/sui/commit/2c2dc9d))



<a name="4.40.0"></a>
# 4.40.0 (2018-01-18)


### Bug Fixes

* improve the separation if the tags are in more than one line ([827d91b](https://github.com/SUI-Components/sui/commit/827d91b))


### Features

* create neww variables for new layout ([4920565](https://github.com/SUI-Components/sui/commit/4920565))
* remove old dependencies and add new ones needed ([2ce8572](https://github.com/SUI-Components/sui/commit/2ce8572))
* tell the user that a prop has a defaultValue but not a propType and fix key ([e410bd9](https://github.com/SUI-Components/sui/commit/e410bd9))
* use React components instead Markdown for Api page with new layout ([a00a0bf](https://github.com/SUI-Components/sui/commit/a00a0bf))
* use snarkdown instead showdown and remove react-render-html dependency ([0ac37c7](https://github.com/SUI-Components/sui/commit/0ac37c7))



<a name="4.39.0"></a>
# 4.39.0 (2018-01-18)


### Features

* apply fullscreen mode ([4306a36](https://github.com/SUI-Components/sui/commit/4306a36))
* force new release ([dc6f400](https://github.com/SUI-Components/sui/commit/dc6f400))



<a name="4.37.0"></a>
# 4.37.0 (2017-11-21)


### Bug Fixes

* reject when error loading playground ([fd46db4](https://github.com/SUI-Components/sui/commit/fd46db4))


### Features

* exported data accesible from playground ([301ff7d](https://github.com/SUI-Components/sui/commit/301ff7d))



<a name="4.36.0"></a>
# 4.36.0 (2017-11-08)


### Bug Fixes

* fix linting error with new import when generating a component ([d497261](https://github.com/SUI-Components/sui/commit/d497261))



<a name="4.35.0"></a>
# 4.35.0 (2017-11-07)


### Features

* use a stable version of peer-deps ([7c97193](https://github.com/SUI-Components/sui/commit/7c97193))



<a name="4.34.0"></a>
# 4.34.0 (2017-11-07)


### Features

* polyfills as vendor ([1b7561b](https://github.com/SUI-Components/sui/commit/1b7561b)), closes [#134](https://github.com/SUI-Components/sui/issues/134)



<a name="4.31.0"></a>
# 4.31.0 (2017-11-06)


### Bug Fixes

* use PropTypes in the component generator ([2ce0b62](https://github.com/SUI-Components/sui/commit/2ce0b62))



<a name="4.30.0"></a>
# 4.30.0 (2017-10-09)


### Bug Fixes

* fix indentatio in generate command ([ed87db0](https://github.com/SUI-Components/sui/commit/ed87db0)), closes [#114](https://github.com/SUI-Components/sui/issues/114)
* generate deps without "latest" ([1bca514](https://github.com/SUI-Components/sui/commit/1bca514))


### Features

* generate repository and homepage fields in package.json ([7ddcc79](https://github.com/SUI-Components/sui/commit/7ddcc79))
* improve README template for generate command ([ff0f314](https://github.com/SUI-Components/sui/commit/ff0f314))



<a name="4.29.0"></a>
# 4.29.0 (2017-10-04)


### Bug Fixes

* fix studio not working in IE browsers ([e352c36](https://github.com/SUI-Components/sui/commit/e352c36))


### Features

* migrate to [@s-ui](https://github.com/s-ui)/react-domain-connector ([bfdb226](https://github.com/SUI-Components/sui/commit/bfdb226))



<a name="4.28.0"></a>
# 4.28.0 (2017-09-21)


### Bug Fixes

* dumb commit to force release ([bf7a60e](https://github.com/SUI-Components/sui/commit/bf7a60e))



<a name="4.27.0"></a>
# 4.27.0 (2017-09-21)


### Features

* Move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([5fa329c](https://github.com/SUI-Components/sui/commit/5fa329c))



<a name="4.27.0"></a>
# 4.27.0 (2017-09-20)


### Bug Fixes

* fix: grouped logs break when an error happens ([a8adfb8](https://github.com/SUI-Components/sui/commit/a8adfb8))
* log errors in fetching of styles ([029dd8f](https://github.com/SUI-Components/sui/commit/029dd8f))



<a name="4.26.0"></a>
# 4.26.0 (2017-09-20)


### Bug Fixes

* register run-parallel in the main bin file ([b7bac46](https://github.com/SUI-Components/sui/commit/b7bac46))


### Features

* command sui-studio run-parallel ([3dbba2d](https://github.com/SUI-Components/sui/commit/3dbba2d))



<a name="4.25.0"></a>
# 4.25.0 (2017-09-19)


### Features

* mark and search by compliant ([c28f6dd](https://github.com/SUI-Components/sui/commit/c28f6dd))



<a name="4.24.0"></a>
# 4.24.0 (2017-09-18)


### Bug Fixes

* enforce displayName for all components ([8638d01](https://github.com/SUI-Components/sui/commit/8638d01))
* fix lint error for trailing spaces ([4245067](https://github.com/SUI-Components/sui/commit/4245067))



<a name="4.22.0"></a>
# 4.22.0 (2017-09-12)


### Features

* make compatible with [@schibstedspain](https://github.com/schibstedspain)/sui-react-domain-connector ([90f82f1](https://github.com/SUI-Components/sui/commit/90f82f1))



<a name="4.21.0"></a>
# 4.21.0 (2017-09-05)


### Bug Fixes

* fix: SPA links don't work in deployments ([cfa7662](https://github.com/SUI-Components/sui/commit/cfa7662))



<a name="4.20.0"></a>
# 4.20.0 (2017-08-31)


### Bug Fixes

* don't rely on the clipboard to set deployment alias ([9a001d3](https://github.com/SUI-Components/sui/commit/9a001d3)), closes [#29](https://github.com/SUI-Components/sui/issues/29)



<a name="4.19.0"></a>
# 4.19.0 (2017-08-30)


### Bug Fixes

* hotfix :ambulance: : NOW_TOKEN variable reference in js syntax instead of shell ([469378e](https://github.com/SUI-Components/sui/commit/469378e))



<a name="4.18.0"></a>
# 4.18.0 (2017-08-30)



<a name="4.17.0"></a>
# 4.17.0 (2017-08-30)


### Features

* add alias set to now deploys ([3c82722](https://github.com/SUI-Components/sui/commit/3c82722)), closes [#92](https://github.com/SUI-Components/sui/issues/92)
* add deploy command using now.sh service ([2927bc0](https://github.com/SUI-Components/sui/commit/2927bc0)), closes [#92](https://github.com/SUI-Components/sui/issues/92)
* add detailed props description in documentation ([94c120a](https://github.com/SUI-Components/sui/commit/94c120a)), closes [#29](https://github.com/SUI-Components/sui/issues/29)
* add table support to mardown views ([cf7596c](https://github.com/SUI-Components/sui/commit/cf7596c))
* build: create 200.html for PWA ([e68d772](https://github.com/SUI-Components/sui/commit/e68d772))



<a name="4.16.0"></a>
# 4.16.0 (2017-08-23)


### Features

* add CHANGELOG tab ([dafe396](https://github.com/SUI-Components/sui/commit/dafe396)), closes [#27](https://github.com/SUI-Components/sui/issues/27)



<a name="4.15.0"></a>
# 4.15.0 (2017-08-09)


### Features

* using V2 of the sui-bundler ([c18bb16](https://github.com/SUI-Components/sui/commit/c18bb16))



<a name="4.14.0"></a>
# 4.14.0 (2017-08-04)


### Bug Fixes

* disabling on the fly loaded style ([acf766a](https://github.com/SUI-Components/sui/commit/acf766a))
* easier disabling, link update ([ada8bc6](https://github.com/SUI-Components/sui/commit/ada8bc6))
* search for component.js just in case ([8b2b78e](https://github.com/SUI-Components/sui/commit/8b2b78e)), closes [#76](https://github.com/SUI-Components/sui/issues/76)


### Features

* pass domain to playground ([3844647](https://github.com/SUI-Components/sui/commit/3844647))



<a name="4.12.0"></a>
# 4.12.0 (2017-07-24)


### Bug Fixes

* update elements z-index ([6a2b16e](https://github.com/SUI-Components/sui/commit/6a2b16e)), closes [#56](https://github.com/SUI-Components/sui/issues/56)


### Features

* perform a npm install after generating a component and check it doesn't already ex ([1dce5ae](https://github.com/SUI-Components/sui/commit/1dce5ae))
* update fse-extra dependency with Promise support ([d38a4ef](https://github.com/SUI-Components/sui/commit/d38a4ef))



<a name="4.11.0"></a>
# 4.11.0 (2017-07-17)


### Bug Fixes

* fix linter error unnecesary escape character ([ae6e1af](https://github.com/SUI-Components/sui/commit/ae6e1af))



<a name="4.10.0"></a>
# 4.10.0 (2017-07-13)


### Features

* less noise on the console by correctly collapsing messages for styles ([7455dfd](https://github.com/SUI-Components/sui/commit/7455dfd))
* show a warning when developer is not adding a context.js but using context in a co ([490c6de](https://github.com/SUI-Components/sui/commit/490c6de))



<a name="4.8.0"></a>
# 4.8.0 (2017-07-13)


### Features

* log demo errors on console too ([f1e1d3d](https://github.com/SUI-Components/sui/commit/f1e1d3d))



<a name="4.8.0"></a>
# 4.8.0 (2017-07-04)


### Bug Fixes

* don't deprecate link command, only mention link-all ([13840f9](https://github.com/SUI-Components/sui/commit/13840f9))


### Features

* command: sui-studio run-all ([cbff577](https://github.com/SUI-Components/sui/commit/cbff577)), closes [#21](https://github.com/SUI-Components/sui/issues/21)



<a name="4.6.0"></a>
# 4.6.0 (2017-06-29)


### Features

* update from origin repo ([62f5ff1](https://github.com/SUI-Components/sui/commit/62f5ff1))



<a name="4.5.0"></a>
# 4.5.0 (2017-06-29)


### Bug Fixes

* take config from config:sui-studio instead of config:suistudio ([26476d9](https://github.com/SUI-Components/sui/commit/26476d9))
* update generate ([1041659](https://github.com/SUI-Components/sui/commit/1041659))


### Features

* migrate to sui-bundler ([1abc9a3](https://github.com/SUI-Components/sui/commit/1abc9a3))
* update from origin repo ([5b5f1be](https://github.com/SUI-Components/sui/commit/5b5f1be)), closes [#62](https://github.com/SUI-Components/sui/issues/62) [#63](https://github.com/SUI-Components/sui/issues/63)



<a name="4.2.0"></a>
# 4.2.0 (2017-06-27)


### Features

* add peer dependencies to sui-studio ([907f846](https://github.com/SUI-Components/sui/commit/907f846))



<a name="4.1.0"></a>
# 4.1.0 (2017-06-25)


### Bug Fixes

* fix run-all for complex commands ([848da14](https://github.com/SUI-Components/sui/commit/848da14))
* fix sui-mono levels to 2 for category/component pattern ([751d4b2](https://github.com/SUI-Components/sui/commit/751d4b2))
* make sui-studio local package ([7af7c90](https://github.com/SUI-Components/sui/commit/7af7c90))
* remove unsued npm co script ([e63ab7e](https://github.com/SUI-Components/sui/commit/e63ab7e))


### Features

* add commit command to sui-studio ([d5839b8](https://github.com/SUI-Components/sui/commit/d5839b8))



