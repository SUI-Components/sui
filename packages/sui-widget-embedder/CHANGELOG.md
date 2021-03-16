# CHANGELOG

# 4.2.0 (2021-01-22)


### Bug Fixes

* widgets not loading in dev mode ([219dfe3](https://github.com/SUI-Components/sui/commit/219dfe3b3224e187ba8d131d56fcd05fac3a7898))



# 4.1.0 (2020-12-22)


### Features

* Use latest and same commander version and avoid installing different versions ([816d42b](https://github.com/SUI-Components/sui/commit/816d42b96b6716ea412c364bc2551f76b71b5195))



# 4.0.0 (2020-11-10)


### Features

* update README with breaking changes and migration guide ([df67a6e](https://github.com/SUI-Components/sui/commit/df67a6e632ada21fd1bee16447c015864cb6c3ba))
* use latest sui-bundler and remove deprecated options ([74c14ba](https://github.com/SUI-Components/sui/commit/74c14ba82555e68e212f9342ca4bbe16760ae7b3))


### BREAKING CHANGES

* Uses latest sui-bundler. Remove deprecated options. Use new jsx import.



# 3.15.0 (2020-09-28)


### Features

* remove not needed change of configuration for optimizations field ([b815c8f](https://github.com/SUI-Components/sui/commit/b815c8fea8838332222690682f87625399d0b461))



# 3.14.0 (2020-08-05)


### Features

* allow a way to send a general context object ([7c548a2](https://github.com/SUI-Components/sui/commit/7c548a2c7571bfc102ababd605e0689cc1e74aee))



# 3.13.0 (2020-06-17)


### Bug Fixes

* ensure array is flatten with NodeList ([3270c5b](https://github.com/SUI-Components/sui/commit/3270c5ba2697643fe794bbb97d16913ee2f4b0c5))


### Features

* allow multiple containers for single Widget ([30ea72e](https://github.com/SUI-Components/sui/commit/30ea72e31d31cdcc00bd52206fd9759cfe7bafba))
* improve PropTypes ([d3d8646](https://github.com/SUI-Components/sui/commit/d3d8646d7fd529422c4d92cdc39c8f72494d2adb))
* publish new beta ([21f554b](https://github.com/SUI-Components/sui/commit/21f554ba9c9077244d29e488626334a411c26d2c))



# 3.12.0 (2020-05-14)


### Features

* support browser context in widget ([efdd72a](https://github.com/SUI-Components/sui/commit/efdd72a1944902b3f9a2f9b2a7ab4d6626f9998b))



# 3.11.0 (2020-04-06)


### Features

* generate theme with new org name ([d7d9969](https://github.com/SUI-Components/sui/commit/d7d9969f5870c13c4c63d27feb8a77da807430fa))



# 3.10.0 (2020-03-27)


### Features

* add new param hrefRegExp to identify the href where the widget will be do ([2080ddb](https://github.com/SUI-Components/sui/commit/2080ddbd5a657a56f0603484cde1d9eaf83a3d36))
* return match regex and fix lint issue ([aec01e3](https://github.com/SUI-Components/sui/commit/aec01e35bac99fa21c5eab566b53d88a78efd12d))



# 3.9.0 (2020-02-05)


### Features

* adds a prop to show/hide widgets where URLs are non deterministic ([4ed36cf](https://github.com/SUI-Components/sui/commit/4ed36cffd015827195075c9c102a85aa967cc490))



# 3.8.0 (2019-11-19)


### Bug Fixes

* make it work without config ([124dc7c](https://github.com/SUI-Components/sui/commit/124dc7c1670f8796275e305a21591dacdfaeca61))



# 3.7.0 (2019-09-12)


### Bug Fixes

* fix dev mode when page already has widgets on it ([7ac3a45](https://github.com/SUI-Components/sui/commit/7ac3a45282165138c86eac5679b9eb4b9ef0155f))



# 3.6.0 (2019-08-16)


### Bug Fixes

* add source map to minify ([7af9051](https://github.com/SUI-Components/sui/commit/7af905114350b46710b25df407b18e9e0600efe9))
* remove not needed slash ([51520ed](https://github.com/SUI-Components/sui/commit/51520ed136ea7ac2aada14cd98979633f62eb407))



# 3.5.0 (2019-08-14)


### Bug Fixes

* use right file ([aecfc4b](https://github.com/SUI-Components/sui/commit/aecfc4bbca31d0ecd8e1ba0c4d9fad8fa7bdf8ba))



# 3.4.0 (2019-05-16)


### Features

* add manuaCompression compatibility to widgets ([b992273](https://github.com/SUI-Components/sui/commit/b992273557a7c82c8aefa88142a37162d65618e7))



# 3.3.0 (2019-04-10)


### Bug Fixes

* problem with React Hooks ([af0c609](https://github.com/SUI-Components/sui/commit/af0c6094dd41c1c96d937c2237c2543a5a2c8d58))
* unresolved problem with React hooks ([8ed3cd3](https://github.com/SUI-Components/sui/commit/8ed3cd3f238a2960ef739c513dbd0c657a6e8e76))



# 3.2.0 (2019-04-10)


### Bug Fixes

* avoid problems with not used HMR on using widget ([b26be4f](https://github.com/SUI-Components/sui/commit/b26be4f897d93e0cc846f2a69d476fce5ee9f7c1))
* remove localhost check for sui-widget-embedder ([406a781](https://github.com/SUI-Components/sui/commit/406a781b6cb124c4c51fd2b9c8b4342348fef145))
* remove not needed dependency ([55a5ee7](https://github.com/SUI-Components/sui/commit/55a5ee7cc51bcdc160e0aa6f90c50c35101011dc))



# 3.1.0 (2019-04-08)


### Bug Fixes

* add missing dependency ([1db8e6a](https://github.com/SUI-Components/sui/commit/1db8e6af64800666f5d074c5a9534f43163f01bb))



# 3.0.0 (2019-04-04)


### Bug Fixes

* disable linter and avoid problems on sui-bundler linter ([f286b24](https://github.com/SUI-Components/sui/commit/f286b243a5b74a2120a82eb2182a45618dcda6f5))
* get back hot reloading ([d683c0f](https://github.com/SUI-Components/sui/commit/d683c0f98c9d30620e48da3ca7850d19281a3594))


### Features

* move to hooks and disable linter to avoid problems on dev ([e32ca9f](https://github.com/SUI-Components/sui/commit/e32ca9f49441b0a00bee08b86299c5499e836ab2))
* remove not needed express dependency and upgrade some ([fd0de22](https://github.com/SUI-Components/sui/commit/fd0de2296ed95d96604dc87ea986050e31bf69a0))
* use new sui-bundler version and some tweaks ([703d1e9](https://github.com/SUI-Components/sui/commit/703d1e9855e60da1f9b7e5b981ad8f3dcdb5ac77))


### BREAKING CHANGES

* Yes! require cannot be mixed with imports, thus some rewriting might be needed. Also, latest
sui-bundler is using babel-preset-sui that doesn't transform import/export and also some deprecated
export sintaxis is not used anymore. If you're using it, check it in order to get it working.



# 2.9.0 (2019-04-03)


### Bug Fixes

* fix wrong context on using pathname.match ([78dcb95](https://github.com/SUI-Components/sui/commit/78dcb953875dfcf53accc0d421506867098019ff))



# 2.8.0 (2019-04-02)


### Features

* add array of regex to check valid pathname ([f7fccaa](https://github.com/SUI-Components/sui/commit/f7fccaa18099717381111b06c1e7e8cdeb4fd053))
* update to latest sui-bundler version ([9fecbce](https://github.com/SUI-Components/sui/commit/9fecbce4357763e8516d98589c1f409d1cd8c87e))



# 2.7.0 (2019-03-11)


### Features

* add support for the new react context ([8d5a624](https://github.com/SUI-Components/sui/commit/8d5a6246b46307d2910d1e9290fbc6e5c1af9a0f))



# 2.6.0 (2019-02-22)


### Bug Fixes

* update generated script ([d66142c](https://github.com/SUI-Components/sui/commit/d66142cb7ccfb0612618277155bbf569322a6cd1))



# 2.5.0 (2019-02-19)


### Bug Fixes

* force babelrc for widget-embedder ([e3e3cc9](https://github.com/SUI-Components/sui/commit/e3e3cc9266569d91542bac81d9e4b57a9a020483))



# 2.4.0 (2019-02-14)


### Bug Fixes

* update load message ([119495b](https://github.com/SUI-Components/sui/commit/119495b81ad4fa8d2fa4f04b3149802cef4ef3fd))



# 2.3.0 (2019-01-22)


### Bug Fixes

* add some improvements ([8335a3a](https://github.com/SUI-Components/sui/commit/8335a3a38a1b27cb0400506f5f20611226f4ed83))
* avoid to define empty array ([45820d5](https://github.com/SUI-Components/sui/commit/45820d5839d20ae34827c6f1741a675fa7361750))
* use normal function instead of arrow function ([4f76645](https://github.com/SUI-Components/sui/commit/4f7664536d977d680e59e7cadb82eb15a3716058))


### Features

* allow to add a blacklist of reg exps ([cd38682](https://github.com/SUI-Components/sui/commit/cd386825798902458f6979317b36d362dbd6e7fc))



# 2.2.0 (2019-01-03)


### Bug Fixes

* change the way the config is loaded ([3fb04d2](https://github.com/SUI-Components/sui/commit/3fb04d20a61946061b9ab90c65af286227c31267))



# 2.1.0 (2019-01-03)


### Bug Fixes

* add serial build error handling ([e31d6f7](https://github.com/SUI-Components/sui/commit/e31d6f70f67f7c2139e6c1a78422193abaa9d088))



# 2.0.0 (2018-12-18)


### Bug Fixes

* avoid forcing config and make it optional ([10d3290](https://github.com/SUI-Components/sui/commit/10d3290add3ff59b6bbb2cb1aa0c2f98f6b894a1))
* by default, aim all the pages if no regExp is provided ([7d23a7a](https://github.com/SUI-Components/sui/commit/7d23a7a79ab4423ff5cb2fdd54d1071e61254be0))
* fix blank space ([14d1fb0](https://github.com/SUI-Components/sui/commit/14d1fb008f5218f929cdd50411be871b88f20194))
* fix missing phrase ([ab3bb64](https://github.com/SUI-Components/sui/commit/ab3bb648d56b3b459441b1561c07eb1c597c6bc0))
* fix templates to generate widgets ([41cc665](https://github.com/SUI-Components/sui/commit/41cc665bfcbd758f1e0292a587084c08b91a1ddb))
* fix typo ([dd0bafd](https://github.com/SUI-Components/sui/commit/dd0bafd6bdd9f7dbef6d6255c4a87e2fa50e0493))
* fix wrong comment for CLI ([a5013ea](https://github.com/SUI-Components/sui/commit/a5013ea8b1fcfa13ea2593fbfd91a2acbc6ea95e))
* more resilient removing of plugin and reuse functionality ([fc2b9d7](https://github.com/SUI-Components/sui/commit/fc2b9d76bd213c9ff1a26176c947d9b16f34eee9))


### Features

* add address parameter ([07bfe40](https://github.com/SUI-Components/sui/commit/07bfe408b6f1598b893a309b3a1aa9c56e545675))
* remove not needed packages ([e769ce9](https://github.com/SUI-Components/sui/commit/e769ce9f658f85479353f975f0ad7ff323915162))
* remove proxy functionality ([2566af0](https://github.com/SUI-Components/sui/commit/2566af00f5104dc626d7ca705b1a31b5c9f0c21f))
* show better console output to use widgets and fix no config ([af7b8d1](https://github.com/SUI-Components/sui/commit/af7b8d1c00da5478bffb123885bb625b191cf3c6))
* use new pages folder instead widgets ([930c648](https://github.com/SUI-Components/sui/commit/930c648c3915ba21784ca9f41810f09d2765ba82))
* use pages instead widgets folder name ([3cb0b98](https://github.com/SUI-Components/sui/commit/3cb0b9857f15f15cc286c9e1241dae87bd48a6c9))


### BREAKING CHANGES

* Now, the expected folder is pages instead widgets, as the widgets are inside pages.
* Proxy functionality removed to simplify development process and lifecycle



# 1.26.0 (2018-12-12)


### Bug Fixes

* set unique jsonpFunction to avoid collisions ([0b33d8e](https://github.com/SUI-Components/sui/commit/0b33d8eddd095fb2a497ba445d4ec0981fb910f6))



# 1.25.0 (2018-12-05)


### Bug Fixes

* disable zindex optimization on cssnano ([d5edd36](https://github.com/SUI-Components/sui/commit/d5edd36016c0df0f2bc70e3d77cf2e024b2217e2))



# 1.24.0 (2018-11-19)


### Bug Fixes

* remove undefined vendor from webpack's config ([1040d4c](https://github.com/SUI-Components/sui/commit/1040d4cd255a85b2dcb9a788c51cde81126e767d))



# 1.19.0 (2018-11-15)


### Bug Fixes

* update files to load ([2586020](https://github.com/SUI-Components/sui/commit/258602070364d5f3842399f6b1c3e9e7e1784425))


### Features

* update entry point to always be app ([7c688b2](https://github.com/SUI-Components/sui/commit/7c688b238f1019007c7719e816df5c45b63a0ee5))



# [1.18.0](https://github.com/SUI-Components/sui/compare/1.12.0...1.18.0) (2018-10-31)



# 1.17.0 (2018-10-31)


### Features

* update bundler version and remove webpack dependency ([79c8077](https://github.com/SUI-Components/sui/commit/79c80777983ec87419002448ba70c04aea688f3f))



# 1.16.0 (2018-10-25)


### Bug Fixes

* update bundler version in order to avoid multiple webpack runtimes collisi ([975e0df](https://github.com/SUI-Components/sui/commit/975e0dfa10a429772cac7013e274639828f042eb))



# 1.15.0 (2018-10-03)


### Bug Fixes

* add ending slash to path ([c136698](https://github.com/SUI-Components/sui/commit/c1366981d54fc026b328b7e0f73f5deed7f9209c))
* added CORS header for dev server ([e3bdbed](https://github.com/SUI-Components/sui/commit/e3bdbeda2768231dde3dfde843d795d038307704))


### Features

* update dev widget server path ([c8f3836](https://github.com/SUI-Components/sui/commit/c8f383690cff068d1ea7df585363de36de77f08f))



# 1.14.0 (2018-03-15)


### Bug Fixes

* ad a / on the remoteCDN publicPath to avoid import errors ([985d742](https://github.com/SUI-Components/sui/commit/985d7420551e093f9ee00dae3bdc2ee35ff873fc))



# 1.13.0 (2018-03-15)


### Features

* implement the remoteCDN on publicPath for chunking purposes. ([dab1a2e](https://github.com/SUI-Components/sui/commit/dab1a2edc84b7f86420abcd4b8f4da21580c608b)), closes [#228](https://github.com/SUI-Components/sui/issues/228)



# 1.11.0 (2018-03-01)


### Bug Fixes

* fix lint errors ([0f25954](https://github.com/SUI-Components/sui/commit/0f25954c618a0c23112f9655451da912e06bf1fa))
* linting errors ([f0b7411](https://github.com/SUI-Components/sui/commit/f0b74114ef0f00fd280f5eb2f425b581685c471c))


### Features

* add help texts, splitted file templates and added some explanations to th ([9102bae](https://github.com/SUI-Components/sui/commit/9102bae66ade981f544ebfd1e945bfd51a3ed89d)), closes [#213](https://github.com/SUI-Components/sui/issues/213)
* added first file ([1f1085f](https://github.com/SUI-Components/sui/commit/1f1085ff4ba2a32c70b9765d0d1ca2bb0ab0d143))
* added package-json modifier to add a new start script ([123a8a1](https://github.com/SUI-Components/sui/commit/123a8a1689e1595df5e6be9d7f724b72984dc7d1))
* added some docs to the readme ([9787d0f](https://github.com/SUI-Components/sui/commit/9787d0f38a7076d1d6737182518b717156f8fc2d))
* added sui widget embedder main file ([ef3b169](https://github.com/SUI-Components/sui/commit/ef3b169828802274d7308183ec426e4127de318c))
* core files created and tested successfully ([6ddd44a](https://github.com/SUI-Components/sui/commit/6ddd44a0026119b3eb0cd1058aa301ab6a9ad799))
* created base generator code taking as an example the sui-studio-generate ([c0fbca7](https://github.com/SUI-Components/sui/commit/c0fbca7444bfceb97d1e331e2c5f0784698ccfb6))
* pr changes, created const variable ([25f86e5](https://github.com/SUI-Components/sui/commit/25f86e51285fd105e12a81f645140ccff9f55f0c))



# 1.10.0 (2018-02-15)


### Features

* enforcin utf-8 enconding to dismiss encoding errors on some sites. ([5bd9a09](https://github.com/SUI-Components/sui/commit/5bd9a099ae9b420aed15fe37f774e765a09de6ac))
* enforcin utf-8 enconding to dismiss encoding errors on some sites. ([c827d9d](https://github.com/SUI-Components/sui/commit/c827d9d20905e7b3da5472643231113b7959fe0e))



# 1.9.0 (2018-02-14)


### Features

* added service worker cdn ([d329378](https://github.com/SUI-Components/sui/commit/d3293781f3524fad8c6dac717e169e1b25a04ddc))
* changed fallback to remoteCDN instead to config.remotecdn ([65d7c9e](https://github.com/SUI-Components/sui/commit/65d7c9e4a956af82b8abf6d855173ea42c37b73c))



# 1.8.0 (2017-12-22)


### Features

* added remoteCdn option on build command to allow us to add custom CDN url ([8134b1c](https://github.com/SUI-Components/sui/commit/8134b1cfcbd4a6eede30233e3f571095029e3e54))



# 1.7.0 (2017-12-12)


### Features

* add sw to precache assets ([4b7909e](https://github.com/SUI-Components/sui/commit/4b7909eee43052784ff8edaafcba0f8c0998df22))



# 1.6.0 (2017-12-11)


### Bug Fixes

* downloader doesnt load in localhost ([b0209a9](https://github.com/SUI-Components/sui/commit/b0209a9ca3eba9690778695fb306f73fe0af68a3))


### Features

* use several pages at the same time ([0f6ab67](https://github.com/SUI-Components/sui/commit/0f6ab676f828b3d1115fd99a3a5d3aaea6099308))



# 1.5.0 (2017-12-11)


### Features

* Changed innerHTML by appendChild to avoid selector childs to be rewritted and event ([c35a4d8](https://github.com/SUI-Components/sui/commit/c35a4d83be031b33feae70e632a6107e711994b1))



# 1.4.0 (2017-11-29)


### Bug Fixes

* be able navigate from a login page ([bbac050](https://github.com/SUI-Components/sui/commit/bbac0502318c566305e693965051d05e94cc5fff))



# 1.3.0 (2017-11-03)


### Features

* pass a static pathname to the cli to avoid the reverse proxy ([0166111](https://github.com/SUI-Components/sui/commit/016611134ac7ceb42f315f096f6f2726a937a8ec))



# 1.2.0 (2017-10-24)


### Bug Fixes

* move @s-ui/bundler to pro deps ([8c8cffc](https://github.com/SUI-Components/sui/commit/8c8cffcaa760bb2cfe2b9fbf01f276d01c3aba1c))



# 1.1.0 (2017-10-24)


### Bug Fixes

* apply PR comments ([ef9e955](https://github.com/SUI-Components/sui/commit/ef9e9554f84cf9148e8b6ea016fe2543158707f6))
* donwloader avoid load assets in localhost ([e1d5ca1](https://github.com/SUI-Components/sui/commit/e1d5ca1c6fe51e7d250047124566d28874811013))
* fix css load ([019420e](https://github.com/SUI-Components/sui/commit/019420e3a9340f04561d8cbf594bc04547f241a2))
* load assets only when there is a match ([5a38d47](https://github.com/SUI-Components/sui/commit/5a38d479f5474a6d8e879bd663ac8aa1ba0c4ad5))


### Features

* build all pages automagicaly ([daf3ddc](https://github.com/SUI-Components/sui/commit/daf3ddcac1eda9476ff96c82a72f5d5da98f2bbb))
* create donwloader.js with the manifests of the assets ([856eae3](https://github.com/SUI-Components/sui/commit/856eae37ee6fedc0869f1fe51e4b64c3aab6cf8c))
* created Widgets components ([2a929fd](https://github.com/SUI-Components/sui/commit/2a929fd63c2e9ae81ae2bfcbfeef4fc7506501c2))
* first commit ([447917f](https://github.com/SUI-Components/sui/commit/447917fc8579152571a479a62b27453e6802ad85))



