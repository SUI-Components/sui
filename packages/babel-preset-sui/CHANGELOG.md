# Change Log

All notable changes to this project will be documented in this file.

<a name="3.0.0"></a>
# 3.0.0 (2019-03-18)


### Features

* bump Major ([8fe5a36](https://github.com/SUI-Components/sui/commit/8fe5a36))
* remove react-hot-loader ([aadc4da](https://github.com/SUI-Components/sui/commit/aadc4da))


### BREAKING CHANGES

* Remove react-hot-loader package



<a name="2.14.0"></a>
# 2.14.0 (2019-02-21)


### Features

* upgrade react-hot-loader for hooks ([f09ce83](https://github.com/SUI-Components/sui/commit/f09ce83))



<a name="2.13.0"></a>
# 2.13.0 (2019-02-19)


### Features

* change proposal for syntax ([942cae3](https://github.com/SUI-Components/sui/commit/942cae3))



<a name="2.11.0"></a>
# 2.11.0 (2019-02-19)


### Bug Fixes

* add [@babel](https://github.com/babel)/plugin-syntax-export-namespace-from ([3f2a733](https://github.com/SUI-Components/sui/commit/3f2a733))



<a name="2.8.0"></a>
# 2.8.0 (2019-02-15)


### Bug Fixes

* add content to empty file ([4dc9228](https://github.com/SUI-Components/sui/commit/4dc9228))



<a name="2.6.0"></a>
# 2.6.0 (2019-02-14)


### Bug Fixes

* add missing files and rename /lib to /src folder ([f91d830](https://github.com/SUI-Components/sui/commit/f91d830))



<a name="2.5.0"></a>
# 2.5.0 (2019-02-14)


### Features

* add [@babel](https://github.com/babel)/plugin-proposal-export-default-from plugin ([e7dcc90](https://github.com/SUI-Components/sui/commit/e7dcc90))



<a name="2.4.0"></a>
# 2.4.0 (2019-02-01)


### Bug Fixes

* add default value for opts ([528e9c9](https://github.com/SUI-Components/sui/commit/528e9c9))



<a name="2.3.0"></a>
# 2.3.0 (2019-01-25)


### Bug Fixes

* fix missing dependency ([f288cb5](https://github.com/SUI-Components/sui/commit/f288cb5))



<a name="2.1.0"></a>
# 2.1.0 (2019-01-25)


### Bug Fixes

* Fix react-hot-loader on linked packages ([42529de](https://github.com/SUI-Components/sui/commit/42529de))



<a name="2.0.0"></a>
# 2.0.0 (2019-01-14)


### Bug Fixes

* add missing "react-hot-loader/babel" ([90ad6e8](https://github.com/SUI-Components/sui/commit/90ad6e8))
* keep compatibility not removing propTypes ([0049a93](https://github.com/SUI-Components/sui/commit/0049a93))


### Features

* add legacy decorators support ([5cc59d8](https://github.com/SUI-Components/sui/commit/5cc59d8))
* add server support for dynamic import and keep chunkNames for client ([6698cd1](https://github.com/SUI-Components/sui/commit/6698cd1))
* move react-hot-loader outside of the babel-preset-sui to be used only in dev ([84f4ecb](https://github.com/SUI-Components/sui/commit/84f4ecb))
* move to babel 7 ([5092dbb](https://github.com/SUI-Components/sui/commit/5092dbb))
* prepare for using api and opts, and use better way plugins and presets ([1818576](https://github.com/SUI-Components/sui/commit/1818576))
* upgrade dependencies ([66c6a44](https://github.com/SUI-Components/sui/commit/66c6a44))
* upgrade dependencies to latest ([a524181](https://github.com/SUI-Components/sui/commit/a524181))
* upgrade to a MAJOR version and publish a beta ([067f24e](https://github.com/SUI-Components/sui/commit/067f24e))


### BREAKING CHANGES

* Use new Babel@7 packages, need to move to new @babel/cli and @babel/core
* The way the dynamic import are handled are different. Some work might be required to apps that are
relying on this preset to transform dynamic import to require.ensure



<a name="1.10.0"></a>
# 1.10.0 (2018-10-16)


### Features

* remove POC flow usage on babel-preset-sui not supported on our platforms ([4ad1343](https://github.com/SUI-Components/sui/commit/4ad1343))



<a name="1.9.0"></a>
# 1.9.0 (2018-09-03)


### Bug Fixes

* rollback dynamic import webpack ([af0e68e](https://github.com/SUI-Components/sui/commit/af0e68e))



<a name="1.8.0"></a>
# 1.8.0 (2018-08-31)


### Bug Fixes

* fix imported plugin ([622d75b](https://github.com/SUI-Components/sui/commit/622d75b))


### Features

* move to Babel 7 ([ab40d77](https://github.com/SUI-Components/sui/commit/ab40d77))
* transpile Webpack Dynamic Imports ([e7087cc](https://github.com/SUI-Components/sui/commit/e7087cc))



<a name="1.7.0"></a>
# 1.7.0 (2018-07-04)


### Features

* update react-hot-loader ([4a0199d](https://github.com/SUI-Components/sui/commit/4a0199d))



<a name="1.6.0"></a>
# 1.6.0 (2018-06-05)


### Features

* use better targeting browsers in order to make more sense ([c54ae10](https://github.com/SUI-Components/sui/commit/c54ae10))



<a name="1.5.0"></a>
# 1.5.0 (2017-10-09)


### Features

* replace es2015 preset by env ([7ed7634](https://github.com/SUI-Components/sui/commit/7ed7634)), closes [#122](https://github.com/SUI-Components/sui/issues/122)



<a name="1.4.0"></a>
# 1.4.0 (2017-09-06)


### Features

* add preact and flow support ([e043d02](https://github.com/SUI-Components/sui/commit/e043d02))


### Performance Improvements

* remove not needed dependency ([46256a8](https://github.com/SUI-Components/sui/commit/46256a8))



<a name="1.3.0"></a>
# 1.3.0 (2017-08-01)


### Features

* add babel-plugin-transform-export-extensions ([7dbc14b](https://github.com/SUI-Components/sui/commit/7dbc14b))



<a name="1.2.0"></a>
# 1.2.0 (2017-07-05)


### Features

* add legacy decorators plugin to make compatible some packages ([2b19af4](https://github.com/SUI-Components/sui/commit/2b19af4)), closes [#39](https://github.com/SUI-Components/sui/issues/39)



<a name="1.1.0"></a>
# 1.1.0 (2017-06-22)


### Bug Fixes

* fix first version to 1.0.0 ([4b4a9b3](https://github.com/SUI-Components/sui/commit/4b4a9b3))



<a name="0.1.0"></a>
# 0.1.0 (2017-06-22)


### Bug Fixes

* rename preset from schibsted-spain to sui ([e5a385f](https://github.com/SUI-Components/sui/commit/e5a385f))


### Features

* migration from babel-preset-schibsted-spain ([ef602e6](https://github.com/SUI-Components/sui/commit/ef602e6))



