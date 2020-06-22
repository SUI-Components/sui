# Change Log

All notable changes to this project will be documented in this file.

# 6.8.0 (2020-06-19)


### Bug Fixes

* allow no staticCacheOnly config ([c380d9b](https://github.com/SUI-Components/sui/commit/c380d9b73dab263e4e592b56e200158b73f3e932))



# 6.7.0 (2020-06-18)


### Bug Fixes

* install "workbox-webpack-plugin" dependency ([0c19efc](https://github.com/SUI-Components/sui/commit/0c19efc3d7ede1b88dfc2a285dcdf342db5628d6))


### Features

* allow import external scripts in our SW ([41b8eee](https://github.com/SUI-Components/sui/commit/41b8eee8de111fc96c7e0e260f1af6960ecb855b))
* bump version ([b5af574](https://github.com/SUI-Components/sui/commit/b5af574da09474c14fb8a4bf3b7baaec3ae5dea3))



# 6.5.0 (2020-06-16)


### Features

* add statics cache only option ([481ffd0](https://github.com/SUI-Components/sui/commit/481ffd0d094f1b28abb46ddf220be505b470638a))



# 6.4.0 (2020-06-15)


### Bug Fixes

* fix check if offline file exists ([6416f6e](https://github.com/SUI-Components/sui/commit/6416f6e7afdfacf7a26de6ceb3945483877ac362))


### Features

* use offlinePath const for copy ([8b5d07a](https://github.com/SUI-Components/sui/commit/8b5d07a2628067d4b670a801bf5fb03c63ec6661))



# 6.3.0 (2020-06-11)


### Features

* better filtering to ditch files not needed for the service-worker ([d3ca81e](https://github.com/SUI-Components/sui/commit/d3ca81e5f59c2c5f9c9439c4bfcbdaf3c1a173a8))



# 6.2.0 (2020-06-09)


### Features

* use register function directly ([b954d05](https://github.com/SUI-Components/sui/commit/b954d059db67bc9c7e70266057ceea3ce85e0bb4))



# 6.1.0 (2020-06-09)


### Bug Fixes

* make options parameter to be optional ([974a36a](https://github.com/SUI-Components/sui/commit/974a36aa9e30a5e8aa313fcb9d5f81077e6da276))



# 6.0.0 (2020-06-09)


### Features

* add dynamic offline page cache (not working) ([1069207](https://github.com/SUI-Components/sui/commit/1069207c55322590bfe8e33905d14e580d439fb7))
* add offline service worker ([dbd6d08](https://github.com/SUI-Components/sui/commit/dbd6d084b2b2ebdd14543aa2936f8469568485d7))
* offline.html file as fallback in offline case ([9132c70](https://github.com/SUI-Components/sui/commit/9132c70a39367fdb60c84be21ab8d77d04dc9a33))
* register callbacks as optional and not env dependant ([4e21e3c](https://github.com/SUI-Components/sui/commit/4e21e3c7b7f97966705c0f818c048dc7303bec33))
* runtime check improved and add docs ([fb33942](https://github.com/SUI-Components/sui/commit/fb33942292fb13fe0e00b3f7ae51d19ed970f212))


### BREAKING CHANGES

* new sw activation api



# 5.49.0 (2020-05-21)


### Features

* support @s-ui/react-router context on linking packages ([c626ec2](https://github.com/SUI-Components/sui/commit/c626ec2b7cc78bdd2c1a45c0c934f48c2f685832))



# 5.48.0 (2020-04-23)


### Features

* update workbox-webpack-plugin ([e219661](https://github.com/SUI-Components/sui/commit/e219661c25d51e9a27dd435508b243e6ed0c94f2))



# 5.47.0 (2020-03-11)


### Bug Fixes

* noopSW require a string ([d102131](https://github.com/SUI-Components/sui/commit/d1021311aead7f1e1e50160e55ff45ec76eae0ea)), closes [/github.com/facebook/create-react-app/commit/1cbc6f7db62f78747cb6ca41450099181139325e#diff-595228c9c4e2f6619c6bb1478ba4ef87L10](https://github.com//github.com/facebook/create-react-app/commit/1cbc6f7db62f78747cb6ca41450099181139325e/issues/diff-595228c9c4e2f6619c6bb1478ba4ef87L10)



# 5.46.0 (2020-03-11)


### Features

* update dependencia of react-dev-utils ([ec58906](https://github.com/SUI-Components/sui/commit/ec58906c9eceadc2378f854f1de876d152b4caac)), closes [/github.com/facebook/create-react-app/issues/8153#issuecomment-574397773](https://github.com//github.com/facebook/create-react-app/issues/8153/issues/issuecomment-574397773)



# 5.45.0 (2020-02-28)


### Features

* upgrade terser to latest version to check if problems fixes ([85a274e](https://github.com/SUI-Components/sui/commit/85a274e6ae75809f4ebe484ea321bfd2045d3888))



# 5.44.0 (2020-02-26)


### Features

* add --link-package flag ([ce86906](https://github.com/SUI-Components/sui/commit/ce8690600742f5fb45d760fffbcbc2a9080602c0))



# 5.43.0 (2020-02-11)


### Performance Improvements

* avoid repetated libraries ([7ccd179](https://github.com/SUI-Components/sui/commit/7ccd179d973b247b634954900e15a922b6bd1ca6))



# 5.42.0 (2020-02-03)


### Features

* remove experimental test flag ([42ded2a](https://github.com/SUI-Components/sui/commit/42ded2a43b58f85b3bcd445443b4a959cbc295f1))



# 5.41.0 (2020-01-30)


### Bug Fixes

* remove deprecated css-content-loader package ([3c91bd7](https://github.com/SUI-Components/sui/commit/3c91bd720f66b7d2894e722485151f2563a41de9))



# 5.40.0 (2020-01-29)


### Bug Fixes

* fix link package ([9bd852d](https://github.com/SUI-Components/sui/commit/9bd852dc76d208c2b4cb9ced90f7d865d5a93532))



# 5.39.0 (2020-01-29)


### Features

* upgrade dependencies ([cc1bd43](https://github.com/SUI-Components/sui/commit/cc1bd43f0d8d7cbe4fc62e6095cb86c7152d71ac))



# 5.38.0 (2020-01-28)


### Bug Fixes

* add __EXPERIMENTAL_TEST__ flag as default ([fc6af19](https://github.com/SUI-Components/sui/commit/fc6af19e4764dbf157f56a97e703db0bffc71878))
* fix not well linked packages ([fd35988](https://github.com/SUI-Components/sui/commit/fd35988d0f734448134e0c0f84e2e06712434a72))
* upgrade dependency to fix weird bug ([52ebe86](https://github.com/SUI-Components/sui/commit/52ebe8654a686b228fde248b20358ff5012d203f))


### Features

* remove not used file-loader ([6568cbb](https://github.com/SUI-Components/sui/commit/6568cbbccbfbbf7d93262d4cf00960169cec7aba))



# 5.37.0 (2020-01-17)


### Features

* upgrade babel version to match babel-preset-sui ([f7a2440](https://github.com/SUI-Components/sui/commit/f7a24408299e4e1972f50b815c6c810b9d06d59a))
* upgrade dependencies and adapt configs with new needs ([4f8504a](https://github.com/SUI-Components/sui/commit/4f8504a80708327ac0e10ace88a8f015be5d9e26))



# 5.36.0 (2019-12-04)


### Features

* remove terser pinned  version ([da16a16](https://github.com/SUI-Components/sui/commit/da16a16c78073fbe53011613548221296277a803))



# 5.35.0 (2019-12-02)


### Bug Fixes

* fix version of terser ([e58612d](https://github.com/SUI-Components/sui/commit/e58612d6de7ce2581b006b02f31a4883bfdfa497))



# 5.34.0 (2019-11-06)


### Features

* add node 13 support by upgrading node-sass ([234442f](https://github.com/SUI-Components/sui/commit/234442f132b4fa6ff9255e05a5f1f044cc8f928f))



# 5.33.0 (2019-10-31)


### Features

* upgrade dependencies of sui-bundler ([3ac90b1](https://github.com/SUI-Components/sui/commit/3ac90b17dbc2dd9c4a45627ccdc733b6c88c3b90))



# 5.32.0 (2019-10-28)


### Bug Fixes

* add fs as empty mock ([e7022e2](https://github.com/SUI-Components/sui/commit/e7022e2de280993c70a00263933ecc58ac02e524))



# 5.31.0 (2019-10-15)


### Bug Fixes

* rollback to raw-loader@1 to fix problems with export files ([8832645](https://github.com/SUI-Components/sui/commit/8832645c2b2972f9607037f77a9a00f2be78994d))



# 5.30.0 (2019-10-14)


### Features

* bump dependencies of sui-bundler ([35258ea](https://github.com/SUI-Components/sui/commit/35258ea3dfbf4684a15be0b5547cd6a37d9976fd))
* upgrade dependencies ([389dad3](https://github.com/SUI-Components/sui/commit/389dad3e7377223da09ae93ebd71221254537ddd))



# 5.29.0 (2019-08-28)


### Features

* externalManifestLoader dont apply in dev mode ([491ca38](https://github.com/SUI-Components/sui/commit/491ca38edaba7a42bb8d507529b4a50589a51347))



# 5.28.0 (2019-08-21)


### Bug Fixes

* remove unnecessary template strings ([499fb33](https://github.com/SUI-Components/sui/commit/499fb336363cd4ff17a5fc8a7a0c21a29d67f113))



# 5.27.0 (2019-08-21)


### Bug Fixes

* Use const instead let to fix linter ([c4aa858](https://github.com/SUI-Components/sui/commit/c4aa858cdb7ba405a6c5b05db251fcc91757aed5))


### Features

* adds the ability to use environment variables to get different URLs ([1279202](https://github.com/SUI-Components/sui/commit/127920228f3c8595928caad77d0893aecb5313da))
* remove dirname in regEx to get manifestURL ([fad8f37](https://github.com/SUI-Components/sui/commit/fad8f37986ada7ad7c3ede124cf2fac3257242eb))



# 5.26.0 (2019-08-14)


### Features

* remove not needed Object.values anymore as node version supported is already supp ([e1b4834](https://github.com/SUI-Components/sui/commit/e1b4834306755f3dd05fdda4fdf043fb5dd56bbd))



# 5.25.0 (2019-07-30)


### Bug Fixes

* fix missing compatibility with eslint 6 ([2590650](https://github.com/SUI-Components/sui/commit/25906504f291665b0b51303295e978a7988a4782))



# 5.24.0 (2019-07-29)


### Features

* add major sui-lint ([e6c725b](https://github.com/SUI-Components/sui/commit/e6c725b66a9e97973d3fbba9fb432a8937bcbde3))



# 5.23.0 (2019-07-23)



# 5.22.0 (2019-07-09)


### Bug Fixes

* move alias parse logic to shared for all environments ([f1d437f](https://github.com/SUI-Components/sui/commit/f1d437f1cfa4901dc83b825e0b4ce78bc69865e5))



# 5.21.0 (2019-07-09)


### Features

* add alias to keep same experiment context on linked packages ([a7c3e6b](https://github.com/SUI-Components/sui/commit/a7c3e6b80032d530773f3d66decc873756445857))
* use ALIAS_FROM_CONFIG in dev webpackConfig instead of a hardcoded alias ([abed07e](https://github.com/SUI-Components/sui/commit/abed07e3986d8f2350f0dffc227c1d2a84ea2358))



# 5.20.0 (2019-07-01)


### Bug Fixes

* return an empty array ([a55ce9d](https://github.com/SUI-Components/sui/commit/a55ce9d779cb310fea0979c053224b60ecb5ccc4))



# 5.19.0 (2019-07-01)


### Features

* add --link-all flag ([c413f17](https://github.com/SUI-Components/sui/commit/c413f178c06bf93e248977b930b1ad327954d9ee))



# 5.18.0 (2019-06-18)


### Features

* move to workbox-webpack-plugin ([e5b959a](https://github.com/SUI-Components/sui/commit/e5b959a8b7580205b6c025a837fb3a03b1dbde16))



# 5.17.0 (2019-06-18)


### Bug Fixes

* sourceMap must be a boolean ([339c457](https://github.com/SUI-Components/sui/commit/339c457d0d8d893a3e5da0ce2a0f23a011bffa90))


### Features

* move to terser instead uglify ([30b0d2d](https://github.com/SUI-Components/sui/commit/30b0d2db960a60e013dab2bb39de2bad8a1617b3))



# 5.16.0 (2019-06-17)


### Bug Fixes

* pass targets config correctly ([7adb727](https://github.com/SUI-Components/sui/commit/7adb72756efa4c75672b55641afac4053813e4ce))


### Features

* add targets config ([4a41ecf](https://github.com/SUI-Components/sui/commit/4a41ecfcd9ea6c3f832b9d254b9f3669216ae875))
* targets now is configurable ([ed82376](https://github.com/SUI-Components/sui/commit/ed823768e35c8d648c67336338129bc1e71b31cf))
* upgrade dependencies ([e7a4ec7](https://github.com/SUI-Components/sui/commit/e7a4ec71f1cb79bd24c75d2af36f18d0e703c58f))
* upgrade dependencies ([7900f81](https://github.com/SUI-Components/sui/commit/7900f815b05eb3d1f1ea34eae2e5bddbce7a936f))



# 5.15.0 (2019-06-06)


### Features

* support react-router-dom link-package ([f534f37](https://github.com/SUI-Components/sui/commit/f534f3772e268b5d0c74a8c971e61a6efd95de10))



# 5.14.0 (2019-06-06)


### Features

* add onlyHash config ([ebad99b](https://github.com/SUI-Components/sui/commit/ebad99b41d7e897c9e05313bce886a1143a13e5f))



# 5.13.0 (2019-05-27)


### Bug Fixes

* fix incompatibility issue when use link-loader ([c2d76f7](https://github.com/SUI-Components/sui/commit/c2d76f7117748ccbc44143038d85bd620be97bdb))
* upgrade to not unsecure dependency ([bafcaff](https://github.com/SUI-Components/sui/commit/bafcaff1f940960218648d1b4b12395e406d6610))



# 5.12.0 (2019-05-24)


### Bug Fixes

* avoid css causing problems ([1871e80](https://github.com/SUI-Components/sui/commit/1871e80865930f355ad0ddd2cbafd3722f53aebf))



# 5.11.0 (2019-05-22)


### Bug Fixes

* avoid ssr missmatch ([211df3d](https://github.com/SUI-Components/sui/commit/211df3d0465eddc21d143de99112436509427b46))



# 5.10.0 (2019-05-21)


### Features

* add externals-manifest feature ([0809229](https://github.com/SUI-Components/sui/commit/08092292f8f8ce7626848ed086e813c5e88628d4))
* fix cache manifest and Readme typos ([14b67cd](https://github.com/SUI-Components/sui/commit/14b67cd254bf4ed1fc25e9f3b6f4bc386682ec4f))
* fix export module ([b6c83a5](https://github.com/SUI-Components/sui/commit/b6c83a57fa765bc8b1a4c027623aec546f2298da))
* reuse logic to load the loader ([47dc435](https://github.com/SUI-Components/sui/commit/47dc435c4aa9f00150ade1dd1b9e41bad95c2bcb))



# 5.9.0 (2019-05-16)


### Bug Fixes

* use require.resolve in order to make compatible with linking ([abf7f21](https://github.com/SUI-Components/sui/commit/abf7f210bd0ea975837232cc98e19b3e48e93092))



# 5.8.0 (2019-04-26)


### Bug Fixes

* force a weird minRatio to force all files to be compressed ([dd68737](https://github.com/SUI-Components/sui/commit/dd6873776d16b14fff73ce3783fcce5342fd9745))
* force compress all the files no matter the weird length could have the result ([2a9d844](https://github.com/SUI-Components/sui/commit/2a9d8443d3a06dd9afe76c924cfd0effeb501add))



# 5.7.0 (2019-04-24)


### Bug Fixes

* use standard extension for gzip files ([ba540cd](https://github.com/SUI-Components/sui/commit/ba540cdd7591991480bdb9369a949fd1a159e85c))



# 5.5.0 (2019-04-11)


### Bug Fixes

* fix sui-bundler ([e604d32](https://github.com/SUI-Components/sui/commit/e604d32895b74040df3e70f41992a8782890b0ac))
* remove param for manual compression, use config instead ([7b9facf](https://github.com/SUI-Components/sui/commit/7b9facf6b7d4010020b442e357dadcec94cd2ebf))



# 5.4.0 (2019-04-11)


### Features

* add -M flag for activating manual compression with the binary ([8afaf98](https://github.com/SUI-Components/sui/commit/8afaf98470c90db09229f09ce25932935932f6e4))
* add gzip and brotli comprssion ([924adb3](https://github.com/SUI-Components/sui/commit/924adb3f9a5263259f6e48edb64917cf7754f2e2))
* add manualCompression behind a flag ([69a1cf4](https://github.com/SUI-Components/sui/commit/69a1cf41b4087fc5938e70381f567207311857d1))



# 5.3.0 (2019-03-20)


### Bug Fixes

* fix linking packages not working with the react context package ([e908d4e](https://github.com/SUI-Components/sui/commit/e908d4e50786a24a4ed4545a68bbc400c726ef4e))



# 5.2.0 (2019-03-18)


### Features

* Move to babel-preset-sui@3 ([ac080bf](https://github.com/SUI-Components/sui/commit/ac080bfe722d70f930b853a7993e928465c2ba2c))



# 5.1.0 (2019-03-18)


### Bug Fixes

* force release of new package and tags ([bd0a45b](https://github.com/SUI-Components/sui/commit/bd0a45b472382f06cf3c5d412570a4184f4a01ed))



# 5.0.0 (2019-03-18)


### Features

* bump major ([4cd98df](https://github.com/SUI-Components/sui/commit/4cd98dfabda32009a67dd30b02a3411ec73c56d8))
* remove react-hot-loader ([a742871](https://github.com/SUI-Components/sui/commit/a7428717616818e98baf7fe56607de088268ace6))


### BREAKING CHANGES

* Remove @hot/loader package



# 4.9.0 (2019-02-28)


### Bug Fixes

* add alias to get linked packages with react hooks working ([1f7ace4](https://github.com/SUI-Components/sui/commit/1f7ace4cff38bab14f10782aa38b4353db79337d))



# 4.8.0 (2019-02-21)


### Features

* patch in development mode react-dom for get working with hooks and other features ([cf25e42](https://github.com/SUI-Components/sui/commit/cf25e426ea0095ed71119fc7ca28e3e22571b81d))



# 4.7.0 (2019-02-11)


### Bug Fixes

* set fixed react-dev-utils version ([f18c6cd](https://github.com/SUI-Components/sui/commit/f18c6cdfcd276e3b58c2f8a33a4e23fe47411532))



# 4.6.0 (2019-02-04)


### Bug Fixes

* force terser version to avoid problems with webpack ([6c3351b](https://github.com/SUI-Components/sui/commit/6c3351b5c5f7a4d8e85a3c2df8dfdfbd683b5722))



# 4.3.0 (2019-01-31)


### Bug Fixes

* alias react-hot-loader to avoid problems when linking a package ([102e28f](https://github.com/SUI-Components/sui/commit/102e28f4be66a1667ee43d87ced5b9f6a826fdef))
* copy dev server url only in first compile ([08a1981](https://github.com/SUI-Components/sui/commit/08a1981b8c2464fa29ab49ebf3780cd8d2f0b58c))
* fix javascript link loader becasue wrong regex, add bunch of comments and prepare ([751842d](https://github.com/SUI-Components/sui/commit/751842d5ab9578270f2fff903d3aaa452904c836))
* fix linking subdependencies, better separation and useful logging ([ec4981c](https://github.com/SUI-Components/sui/commit/ec4981cf0fce557b989c00aa32a99bff45b2a282))
* fix problems with capitalcase ([0dce3ba](https://github.com/SUI-Components/sui/commit/0dce3ba58b25830ebe17021abd346a6c1596df87))


### Features

* separate sassLinkLoader ([06abb73](https://github.com/SUI-Components/sui/commit/06abb73c11d82726890fcfff24766aac2eecdbb5))



# 4.2.0 (2019-01-25)


### Bug Fixes

* Fix react-hot-loader on linked packages ([1aaf396](https://github.com/SUI-Components/sui/commit/1aaf39629b2d5b2851e598302957ad8031311183))



# 4.1.0 (2019-01-15)


### Features

* add sourcemaps section to README documentation ([f497cd5](https://github.com/SUI-Components/sui/commit/f497cd521a71769ecf796d6bef3837498714c9db))
* add sourcemaps support to improve integration with sentry ([2ee87ff](https://github.com/SUI-Components/sui/commit/2ee87ffdcac3dcab6d53f5b0feace258f5b5ee3a))
* remove unnecessary comment from uglifyjs config ([61aea8c](https://github.com/SUI-Components/sui/commit/61aea8cc68fa887ea2714c12f836a180fa1e8324))



# 5.0.0 (2019-01-14)


### Bug Fixes

* add missing babel-cli ([24b7307](https://github.com/SUI-Components/sui/commit/24b73074fb99454a7f9d0c097fc249f1e6c1e8ee))


### Features

* use new babel-preset-sui ([97ee9b3](https://github.com/SUI-Components/sui/commit/97ee9b311069aa3ce94a0a4d3fc5ca13cd28f64f))


### BREAKING CHANGES

* Load new babel-preset-sui, stop using old babel-runtime and use @babel/runtime



# 3.34.0 (2019-01-07)


### Bug Fixes

* fix security issues with compromised dependencies ([46e450f](https://github.com/SUI-Components/sui/commit/46e450fd19ab34f7b8c40af25176412d88320873))
* remove default value not needed ([e3b9cf0](https://github.com/SUI-Components/sui/commit/e3b9cf024d9158732a2a7514991a80f418c36368))


### Features

* add react-hot-loader for dev webpack usage with babel preset sui ([a226993](https://github.com/SUI-Components/sui/commit/a22699385f9dc41cd1feb9ff4da257726bc76b62))
* add react-hot-loader/babel for webpack dev ([385d9ca](https://github.com/SUI-Components/sui/commit/385d9ca86868fdcae85032ea989d23bd646fa1fb))
* back to simple object instead function ([f88e3d2](https://github.com/SUI-Components/sui/commit/f88e3d254ef1b0912a81b347c0022aefcdcd145a))
* bump to MAJOR version to publish beta ([4d43fff](https://github.com/SUI-Components/sui/commit/4d43fff9fb142dd2f49fb7e9de5d782f36c34829))
* new beta ([2aafa25](https://github.com/SUI-Components/sui/commit/2aafa25f35f124a715c0f9674abf71324eed5401))
* upgrade dependencies ([5e5976e](https://github.com/SUI-Components/sui/commit/5e5976ec1f605631a236ee22365a1baf0952135c))


### BREAKING CHANGES

* Uses new babel-preset-sui major version and need to use latest babel/core version not compatible
with the old one



# 3.32.0 (2018-12-11)



# 3.31.0 (2018-12-11)


### Bug Fixes

* fix Windows RegExp syntax in LoaderConfigBuilder ([e626c3c](https://github.com/SUI-Components/sui/commit/e626c3c3da94db2f3704340b895eb5517171bee1))
* new release with fix for npm-run-all ([8431bca](https://github.com/SUI-Components/sui/commit/8431bca8f183bfcd804b25c49d5c98850e986c3d))



# 3.30.0 (2018-12-11)


### Bug Fixes

* fix windows bug with Regex rules ([d1dffa7](https://github.com/SUI-Components/sui/commit/d1dffa7dc435f3f7526da4feb2bd1d59813a888f))



# 3.29.0 (2018-12-04)


### Bug Fixes

* ignore scss import files in server ([e41163e](https://github.com/SUI-Components/sui/commit/e41163ef29eae46f8cd372559e356cddd72fb21a))


### Features

* add server support for dynamic import and keep chunkNames for client ([6698cd1](https://github.com/SUI-Components/sui/commit/6698cd1b87ebf7ebc76038390834d6c4f7285b68))



# 3.28.0 (2018-11-08)


### Bug Fixes

* fix resolves to better linking and be sure we use own versions ([d21e581](https://github.com/SUI-Components/sui/commit/d21e581bf6c9ad27d304b0c10dc6439a4476897e))


### Features

* add option to make no pre loaders run ([d0d240b](https://github.com/SUI-Components/sui/commit/d0d240b7f18b3be439127dc256d760daa43d4ff5))
* show port when compilation is not broken, only a warning ([5be259d](https://github.com/SUI-Components/sui/commit/5be259dc414f063a748178221b2d1c974d8f7dad))
* update to new options from babel-loader ([6a152d8](https://github.com/SUI-Components/sui/commit/6a152d832d0b9d39089d70dd1cf68cae1b15eea8))
* upgrade dependencies ([823cc94](https://github.com/SUI-Components/sui/commit/823cc94326c9d09ea6f27a350fabc3c142bc56ca))
* upgrade dependencies from babel7 ([8f85757](https://github.com/SUI-Components/sui/commit/8f85757b5ffe0adcb35ed706e97872ff09d505dc))
* use new babel-loader with Babel@7 ([4b42854](https://github.com/SUI-Components/sui/commit/4b4285480c5a6955a5ca27a0f6bcd5faabf6a239))



# 3.27.0 (2018-10-25)



# 3.26.0 (2018-10-24)


### Bug Fixes

* fix jsonp function param in webpack lib config ([28b3749](https://github.com/SUI-Components/sui/commit/28b3749c35b5423ba2064ce060f44b109af641b0))


### Features

* add resolve.alias to be passed as config param ([9ac79ba](https://github.com/SUI-Components/sui/commit/9ac79bab7463a183f45b721abe6cfa55ee73727b))



# 3.25.0 (2018-10-15)


### Features

* update bundle analyzer to latest version ([9604fcd](https://github.com/SUI-Components/sui/commit/9604fcd235655188fc52113c4397e0f3665a8241))



# 3.24.0 (2018-10-09)


### Bug Fixes

* avoid collision of multiple webpack runtimes ([d6f627c](https://github.com/SUI-Components/sui/commit/d6f627cf78bfc6ef813fba7ac63770ceb5f7d51b))
* avoid collision of multiple webpack runtimes ([6e65145](https://github.com/SUI-Components/sui/commit/6e65145cff8c714a7d70913af4382299b5b0b379))



# 3.23.0 (2018-10-02)


### Bug Fixes

* let our bundler notice us about our bundle environment ([8f92953](https://github.com/SUI-Components/sui/commit/8f92953ae1e2f9d327191630b53876dd0b172196))



# 3.22.0 (2018-09-26)


### Bug Fixes

* add optimization node env overwrite to false in order to avoid side effects on ser ([888d34d](https://github.com/SUI-Components/sui/commit/888d34d00d792cef2bb417b0ca35f8400d89ba2d))



# 3.21.0 (2018-09-20)


### Bug Fixes

* fix webpack mode when compile a server ([e2bec1c](https://github.com/SUI-Components/sui/commit/e2bec1cabf9c85c269899ac4989ed5ec18cc6f2b))



# 3.20.0 (2018-08-20)



# 3.19.0 (2018-08-16)


### Bug Fixes

* adjust public path on root=true ([0698bc5](https://github.com/SUI-Components/sui/commit/0698bc554720c5d1c927bd16aea362cde2d51e48))
* warn when library path is not provided ([c94490e](https://github.com/SUI-Components/sui/commit/c94490eb01fcb9993ff21b652aebedfa84a915fb))


### Features

* adds relative to absolute path conversion ([64785a2](https://github.com/SUI-Components/sui/commit/64785a2cd3f42422babb28ad311d2f37d1674a5a))
* sui-bundler lib --umd option ([6e76e57](https://github.com/SUI-Components/sui/commit/6e76e570a52a4415844bd5a6638e6c0ac6fd7ddc))



# 3.18.0 (2018-08-10)


### Bug Fixes

* now sass is linked too ([ed30901](https://github.com/SUI-Components/sui/commit/ed30901871f5bdebffe1882c5f8c3090518ba42a))



# 3.17.0 (2018-08-07)


### Bug Fixes

* let autoprefixer comments to avoid problems ([be99f15](https://github.com/SUI-Components/sui/commit/be99f159f673f6777adbedc817c3803c73e788d7))



# 3.16.0 (2018-08-07)


### Features

* remove all comments on CSS after building it ([d76cfa9](https://github.com/SUI-Components/sui/commit/d76cfa919f9504b5ac7313fe542e546c87aa2dae))
* update all dependencies to latest and remove not used ones ([6576422](https://github.com/SUI-Components/sui/commit/65764222756774d061e818956e029b63a31b9759))



# 3.15.0 (2018-08-06)


### Bug Fixes

* use sui-bundler analyze wihout removed dependency ([b19a233](https://github.com/SUI-Components/sui/commit/b19a233b67d8ec8688b79b7bfbdd12b059f3ac5e))



# 3.14.0 (2018-08-06)


### Features

* bump version ([7d629cf](https://github.com/SUI-Components/sui/commit/7d629cfe4784c0cc99b7ed781d0a9bce5cce1253))



# 3.12.0 (2018-08-06)


### Bug Fixes

* fix error with default parameters ([05ef733](https://github.com/SUI-Components/sui/commit/05ef733b052ad931ae0c8be8e8eaebe8ed1aa6ec))


### Features

* add link-loader ([8590edb](https://github.com/SUI-Components/sui/commit/8590edb43cba04fb94c36e65a0f156209dfd9068))
* improve console output ([ce10da8](https://github.com/SUI-Components/sui/commit/ce10da8b9bebe2db6f20a3f7d5b041696637755b))



# 3.12.0 (2018-07-27)


### Features

* export a start function ([c5cc60b](https://github.com/SUI-Components/sui/commit/c5cc60b155423c92949819a0ecdfd7cecc88fabb))
* option to not use version directory ([deb58bf](https://github.com/SUI-Components/sui/commit/deb58bf452ae17cb61a17bb3e73bf0b71526ed17))



# 3.11.0 (2018-07-13)


### Bug Fixes

* fix Travis CI broken when used node 10 ([735fafa](https://github.com/SUI-Components/sui/commit/735fafadbcf439a84dc43e8225900ca359572871))



# 3.10.0 (2018-07-10)


### Bug Fixes

* allow last versions of sui-helpers ([3ec95d1](https://github.com/SUI-Components/sui/commit/3ec95d1870d972acf7bb0cf78f2f6a14ec3504ca))


### Features

* improve dev with eslint loader ([fe74597](https://github.com/SUI-Components/sui/commit/fe745979cc17c1822c062b3a41c00e2515d3d4c2))
* use cacheBabel compiled ([00ba04c](https://github.com/SUI-Components/sui/commit/00ba04caa1a0c24167c5dee812228a7e0b7c0313))
* use react-dev-tools for dev command ([fc43780](https://github.com/SUI-Components/sui/commit/fc43780cf489c9d01010ab02763bc771dcef9ffb))



# 3.9.0 (2018-06-25)



# 3.8.0 (2018-06-21)


### Bug Fixes

* fix bundling in windows ([ed9c416](https://github.com/SUI-Components/sui/commit/ed9c4163079bb09a5ab37b013fbfce7f461794ff))
* use Object.assign instead spread operator ([4bab0f8](https://github.com/SUI-Components/sui/commit/4bab0f8cc43680386692ae2c68ca484b725bd5d1))
* use Object.assign instead spread operator ([ecb8ac9](https://github.com/SUI-Components/sui/commit/ecb8ac96108a6ac1d0516173c6f206ea3dc762c2))



# 3.7.0 (2018-06-20)


### Features

* bump version ([c4d2567](https://github.com/SUI-Components/sui/commit/c4d2567a1962cfe4ea80425944014f230c91daac))



# 3.6.0 (2018-06-20)


### Bug Fixes

* prepare for windows ([3dd607a](https://github.com/SUI-Components/sui/commit/3dd607a4c00743c2112466903de1ee585897e7e1))


### Features

* add context option to build ([49285e5](https://github.com/SUI-Components/sui/commit/49285e5972e82266406098c0cf10567eaf14c337))
* use index.html like fallback ([b84e916](https://github.com/SUI-Components/sui/commit/b84e9161293fa99cafba84c71ee1caeffcf709f3))



# 3.5.0 (2018-06-13)


### Bug Fixes

* sui-bundler dev not using babel-preset-sui ([d0ca7ef](https://github.com/SUI-Components/sui/commit/d0ca7ef1848a9556a05f7f3fc221f6a04844db83))



# 3.4.0 (2018-06-11)


### Features

* sui-bundler lib to bundle libraries ([4df41ac](https://github.com/SUI-Components/sui/commit/4df41ac0f2176147ee189f7015e7fd861afccb57))



# 3.3.0 (2018-05-10)


### Bug Fixes

* fix regression that runtime has not been created ([90994ff](https://github.com/SUI-Components/sui/commit/90994ff9dd89a2a15a12ae75957ebff88e8676f7))



# 3.2.0 (2018-05-04)


### Bug Fixes

* avoid use Gently in the server config ([8d79955](https://github.com/SUI-Components/sui/commit/8d799552fdb39dca8a4ae69208e58e28395c3325))



# 3.1.0 (2018-04-30)


### Bug Fixes

* use Object.assign for compatibility withh node 6 ([424da99](https://github.com/SUI-Components/sui/commit/424da99ab9977b981bb2f82863542b78b52369b8))



# 3.0.0 (2018-04-12)


### Bug Fixes

* loadUniversalOptionsPlugin in pro as well ([b069576](https://github.com/SUI-Components/sui/commit/b0695763936bb12d5fb3d724a777a836b12ac070))


### Features

* adapt production configuration to be as development ([216fa61](https://github.com/SUI-Components/sui/commit/216fa614b3344c84466779422a33d7abf8d195d1))
* adapt production configuration to new versions ([d6474d5](https://github.com/SUI-Components/sui/commit/d6474d56fdf49bf9ee85f7a5a131b14e45ff0c89))
* merge ([6a3f18d](https://github.com/SUI-Components/sui/commit/6a3f18dfee2160138f881ef03bcd81e26ea37f71))
* remove json-loader and use native instead ([a8d939f](https://github.com/SUI-Components/sui/commit/a8d939fea0a86a95aa78a69aaf67c49be9cb62e9))
* remove not needed loaders for some files and rollback to loader ([dd6a81a](https://github.com/SUI-Components/sui/commit/dd6a81a1b5244f3c1f067171bd8ff023c050eae1))
* return loaderOptionsPlugin to be used ([5b6c358](https://github.com/SUI-Components/sui/commit/5b6c358a7a68b731c7d827165e630d48453f0e49))
* update dependencies ([bbe43b1](https://github.com/SUI-Components/sui/commit/bbe43b1fa66f0cd99702bc5f43da6f2c24f931e4))
* update dependencies ([6788838](https://github.com/SUI-Components/sui/commit/6788838c5877e78fd6e9be009d2556df9c5174f3))
* update dependencies ([55217aa](https://github.com/SUI-Components/sui/commit/55217aa5db02949471efba0a28c7e0f332b1e73e))
* update html-webpack-plugin version ([389f546](https://github.com/SUI-Components/sui/commit/389f5469e3cf3acd07a34def6e3f5d5d688b8112))


### BREAKING CHANGES

* Stop supporting a way to load fonts, images and other files on your code
* No support for loading fonts, svg and images from your project anymore



# 2.15.0 (2018-03-28)


### Bug Fixes

* specify include and avoid getting others babelrc than the one we want ([12f60af](https://github.com/SUI-Components/sui/commit/12f60af84eb9c1b176a6a6fb1d122b72f586114c))
* update dependencies to fix some problems ([e2f8370](https://github.com/SUI-Components/sui/commit/e2f8370420b48f54bf86deeaf9275a09892f4460))


### Features

* add node-externals dep ([bd09441](https://github.com/SUI-Components/sui/commit/bd09441a4ae8adf46aea79d918d0b58a85a6a712))
* add server config ([cbc8a01](https://github.com/SUI-Components/sui/commit/cbc8a0186ea37e16bfa697130854d6084b996982))
* relay more on default values ([99694b2](https://github.com/SUI-Components/sui/commit/99694b203ba6771b965df9cce87e02ce79a6fa6f))
* remove deprecated way to add to the loader the config on PRO ([b9fb841](https://github.com/SUI-Components/sui/commit/b9fb8410c29ead0029285026f2a97dbf3bb82317))
* stop using old loader for webpack 2 and kiss ([0a83817](https://github.com/SUI-Components/sui/commit/0a838171de27a2c99a4e75fe9273bae47872a306))
* update dependencies ([e448b94](https://github.com/SUI-Components/sui/commit/e448b9464d9334758e3e84702afef1f5140ef103))
* update dependencies ([988eb62](https://github.com/SUI-Components/sui/commit/988eb62c8b833878a0ee60e7f92990147297bd4d))
* update dependencies to latest versions and ensure Webpack 4 compatibility ([9771c45](https://github.com/SUI-Components/sui/commit/9771c454c0c91505ced0ff406d0a85b84c3f26c1))
* update node-sass-json-importer ([9da5273](https://github.com/SUI-Components/sui/commit/9da5273f8a3128ab1b5236dee468038237c01df1))
* update to latest dependencies con hotfixes and webpack 4 support ([8ef23f7](https://github.com/SUI-Components/sui/commit/8ef23f73755183285ac18617046efa184f257320))
* use latest versions of dependencies ([2237dfe](https://github.com/SUI-Components/sui/commit/2237dfe77e3c6f30684598c9a53470eadb03cae2))
* use manual vendor ([b03e2f6](https://github.com/SUI-Components/sui/commit/b03e2f67478951d17274713fdcfce905a67784b3))



# 2.14.0 (2018-02-28)


### Features

* translate to english ([d8d812f](https://github.com/SUI-Components/sui/commit/d8d812fdb595560babddb3101a3580611b7b13ac))
* update dependencies ([3b3c74a](https://github.com/SUI-Components/sui/commit/3b3c74a1cf9ab1eb3316460e14656e13d3a08254))
* update dependencies ([bda676d](https://github.com/SUI-Components/sui/commit/bda676dfc471a651ea734268efb872a96ff6883c))
* use babel-loader new version compatible with webpack 4 ([e7defdf](https://github.com/SUI-Components/sui/commit/e7defdf14648f1de2b6b0890e6aa6c8fc3dd67d9))



# 2.13.0 (2018-02-22)


### Features

* add a way to modify the config for Webpack's scriptsExtPlugin ([51cdfac](https://github.com/SUI-Components/sui/commit/51cdfacc6faffb72014f278917034a922e2e7bcc))



# 2.12.0 (2018-02-05)


### Features

* show the time used for dev bundling ([5ffb110](https://github.com/SUI-Components/sui/commit/5ffb1102b77e4c377b1304861d297ec2f6aa99e4))
* use new modules use rules ([cafb5bb](https://github.com/SUI-Components/sui/commit/cafb5bbc9ca41c0bcb4b0a47dd8241ddee9da128))



# 2.11.0 (2017-12-28)


### Features

* remove browser-sync as not being used anywhere and adding building time ([ad513a2](https://github.com/SUI-Components/sui/commit/ad513a2adc4fb0375c594d3f4b7544cb3fe7a72f))



# 2.10.0 (2017-11-10)


### Features

* update to latest webpack version ([5efa34f](https://github.com/SUI-Components/sui/commit/5efa34fe1679b08b89e2ce1b72355816d8826f3c))
* use new uglifyJSPlugin version ([ae6830e](https://github.com/SUI-Components/sui/commit/ae6830eb667c53bbbd206b74c6c4288d5938a0df))



# 2.9.0 (2017-09-21)


### Bug Fixes

* replace references to sui-studio by s-ui/studio ([4dfffb9](https://github.com/SUI-Components/sui/commit/4dfffb9eb3a06d3cace0b007a917ee5b99931c87))



# 2.8.0 (2017-09-21)


### Bug Fixes

* replace references to schibstedspain ([cd17403](https://github.com/SUI-Components/sui/commit/cd174037f51f3117aa45488867e80e5d542bb1ee))



# 2.7.0 (2017-09-21)


### Features

* move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([2687a1f](https://github.com/SUI-Components/sui/commit/2687a1fc8c9fc969adbfd060c07dde419e516189))



# 2.6.0 (2017-09-13)



# 2.5.0 (2017-08-29)


### Bug Fixes

* fix build broken in windows ([2b6441e](https://github.com/SUI-Components/sui/commit/2b6441e4f1ec1052c5b1a76ba9f5496510e064df))



# 1.20.0 (2017-08-29)



# 2.4.0 (2017-08-29)


### Bug Fixes

* fix json files not loading in sass imports ([02677c1](https://github.com/SUI-Components/sui/commit/02677c1e8bcc08eb9482c453b9712bd0f8ce1fea))



# 2.3.0 (2017-08-09)


### Bug Fixes

* working inside the sui-studio ([c782bf0](https://github.com/SUI-Components/sui/commit/c782bf0f679d89e9f284f584d3d71122965fa15c))



# 2.2.0 (2017-07-27)


### Bug Fixes

* fix problems with postCss because API changed for the loader ([e60ed20](https://github.com/SUI-Components/sui/commit/e60ed20b60a1eea54fc451c0227c95d67aca0ba2))



# 2.1.0 (2017-07-27)


### Features

* update to webpack 3.4.0 ([b28275b](https://github.com/SUI-Components/sui/commit/b28275b4f915a02e9149090a504903cf6765cf3e))



# 1.5.0 (2017-07-17)


### Bug Fixes

* fix wrong way to check hasErrors and hasWarnings, always was undefined ([b5b8421](https://github.com/SUI-Components/sui/commit/b5b84215676cd7405b93c02dd70525dace14cfe1))


### Features

* add Duplicated NPM Package checker on analyzing ([1809284](https://github.com/SUI-Components/sui/commit/1809284204ffca987c409b449de92aeb499b6656))



# 1.4.0 (2017-07-10)


### Bug Fixes

* use contenthash because chunkhash sometimes doesnt change ([ca03399](https://github.com/SUI-Components/sui/commit/ca03399404ba0a8accf7f1e942b3765576290d49))



# 1.3.0 (2017-07-05)


### Features

* use prefetch instead preload to avoid blocking requests ([582d59e](https://github.com/SUI-Components/sui/commit/582d59ef97fbf9198a3e12a023f76705e8c5ed02)), closes [#41](https://github.com/SUI-Components/sui/issues/41)



# 1.2.0 (2017-07-04)


### Bug Fixes

* remove react alias as not need ([9db2e7a](https://github.com/SUI-Components/sui/commit/9db2e7a30c4dcf1c34a1c53dd3d6c24cf0ecddb1))


### Features

* rename package and its binary ([0f57470](https://github.com/SUI-Components/sui/commit/0f5747084619b3480b5d7338316ab1a749b2c4b9))
* update sui-bundler from suistudio-webpack ([5bd67f4](https://github.com/SUI-Components/sui/commit/5bd67f47ad79f89696d9a2960fe3e5cd2a0be3ef))


### BREAKING CHANGES

* CLI has changed name



# 3.4.0 (2017-06-27)


### Features

* migrate from sui-studio-webpack ([1b58081](https://github.com/SUI-Components/sui/commit/1b58081774048ab5c6be1f68d564d219294265bd))



