# CHANGELOG

# 4.24.0 (2025-08-05)


### Features

* add pageData middleware ([dd3a6c3](https://github.com/SUI-Components/sui/commit/dd3a6c319c0560c5ae6d2d4b44e17e920850a80d))



# 4.23.0 (2025-08-01)


### Features

* adapt logic to specific user consents ([7eb6439](https://github.com/SUI-Components/sui/commit/7eb64391b9139ca8cd9cdf29d120e85e6c70f5c4))
* send google consents on each event ([f70ef00](https://github.com/SUI-Components/sui/commit/f70ef005b80ef7ca515b15076d22ba1e697abab1))



# 4.22.0 (2025-07-29)


### Features

* fix typo ([2c8207a](https://github.com/SUI-Components/sui/commit/2c8207ad41b3aa0fcd9148ebdde52b0f1e8d7917))
* update userid parsing ([b965201](https://github.com/SUI-Components/sui/commit/b9652012372b24f9cfaa89dbedd6a4ac5cd8fc00))



# 4.21.0 (2025-07-29)


### Features

* add prefix check ([bf53997](https://github.com/SUI-Components/sui/commit/bf539975c374983506d9cf8162ab934eda817641))
* add userIdPrefix prop ([a9f3d8d](https://github.com/SUI-Components/sui/commit/a9f3d8d84d0ca8fd4bd4083bcde0accebbcffc9d))
* remove log ([c532ef4](https://github.com/SUI-Components/sui/commit/c532ef442c0c64009ca7d72f719de65a8159dfe9))



# 4.20.0 (2025-05-28)


### Bug Fixes

* update xandr url query param for consent ([c502541](https://github.com/SUI-Components/sui/commit/c502541196d4c635465aaa11e52d0bb958dda967))



# 4.19.0 (2025-03-26)


### Features

* skip universal id retrieval on server ([3637030](https://github.com/SUI-Components/sui/commit/3637030a0520eabfd7871cfb4737005845c43815))



# 4.18.0 (2025-03-20)


### Features

* DENIE consent if it fails to retrieve it ([cffeee7](https://github.com/SUI-Components/sui/commit/cffeee70ec29750752c2e86ee57c35a8032176f4))



# 4.17.0 (2025-03-20)


### Bug Fixes

* map analytics_storage to correct value ([6122f59](https://github.com/SUI-Components/sui/commit/6122f59fcd71a0a3d30769ffe61453fc01adc082))



# 4.16.0 (2025-03-19)


### Features

* Added analytics_storage privacy state for segment ([a7111a5](https://github.com/SUI-Components/sui/commit/a7111a5ddb170cf919c2cb6ea6500cb3ffe5a588))



# 4.15.0 (2025-03-12)


### Bug Fixes

* Not send campaing details if stc is invalid ([18fd59e](https://github.com/SUI-Components/sui/commit/18fd59e698eef06897c343c0b653c7f2488dde46))



# 4.14.0 (2025-02-13)


### Bug Fixes

* Remove adobeCloudVisitorId from GA4 and send event when session s ([2f65d7f](https://github.com/SUI-Components/sui/commit/2f65d7f4764ff00f1ea286aeed711b1383374936))



# 4.13.0 (2025-01-24)


### Features

* force bump ([1bd2ebe](https://github.com/SUI-Components/sui/commit/1bd2ebe7bb118e8bdc69d1854bd1d969377e3d98))
* promise all allowed methods ([ebc0329](https://github.com/SUI-Components/sui/commit/ebc0329bfe9eb9172031ab6fe80ac958512d8f5c))
* send adobe mvcid along the ga event ([8938f67](https://github.com/SUI-Components/sui/commit/8938f67a1f6b38810fc2c2b004ce4fc776a38e8d))
* send it along all ga events ([e5d118a](https://github.com/SUI-Components/sui/commit/e5d118aee7c655d12673f41a09582078a253ded4))



# 4.12.0 (2025-01-24)


### Features

* get client id synchronously ([37f2651](https://github.com/SUI-Components/sui/commit/37f2651be223dcf208852c8fd44b7f9b20c084e0))



# 4.11.0 (2024-12-17)


### Features

* send init event once per session ([2e04118](https://github.com/SUI-Components/sui/commit/2e0411855cb1dd5a321820e36242ea6d222f8d87))



# 4.10.0 (2024-11-26)


### Features

* send client version as context property ([12fff81](https://github.com/SUI-Components/sui/commit/12fff8171522a770485d6e5e9e75309046371c62))
* send version always ([8caf104](https://github.com/SUI-Components/sui/commit/8caf104d91fdebfd83df18effe95c3eee18ab907))
* set version on lib compilation ([f522f3a](https://github.com/SUI-Components/sui/commit/f522f3aaa8bf4d0e161f3ccb4ce3e487fb635542))



# 4.9.0 (2024-11-15)


### Features

* stop caching ga fields and catch errors ([cf4a4b9](https://github.com/SUI-Components/sui/commit/cf4a4b927cbbfaa973ca6cae12eb09f04f58c4f7))



# 4.8.0 (2024-10-24)


### Bug Fixes

* fix stc mapping ([57462bd](https://github.com/SUI-Components/sui/commit/57462bd97720993ffd36f1da05f2d7b4bbfdbcc2))



# 4.7.0 (2024-10-22)


### Features

* modify set method ([cf37a8e](https://github.com/SUI-Components/sui/commit/cf37a8e761f73bb7ba6fcb1ed7a765d41cc5b630))
* set ga user id on identify ([1184d81](https://github.com/SUI-Components/sui/commit/1184d8143f18ab7cb6d5245f43ee589299215e49))



# 4.6.0 (2024-10-22)


### Features

* map campaign data ([48d8b9e](https://github.com/SUI-Components/sui/commit/48d8b9e707a74586cec93544ec0a2136bb1892ae))



# 4.5.0 (2024-10-10)


### Features

* send init event and retrieve the session id ([fa9fd16](https://github.com/SUI-Components/sui/commit/fa9fd16dbf9ce34d9c2e66c4a77c2792b08345ab))



# 4.4.0 (2024-10-09)


### Bug Fixes

* fix google analytics script load ([3eb7f2c](https://github.com/SUI-Components/sui/commit/3eb7f2cb97b6c50100d319bf9b9802ce2725bf3e))


### Features

* add ga4 client id to segment events ([e669b28](https://github.com/SUI-Components/sui/commit/e669b28a983d0d992bd646b94670931711405402))



# 4.3.0 (2024-09-19)


### Features

* force new release ([5a0ee5b](https://github.com/SUI-Components/sui/commit/5a0ee5bd56eca33f6b7cfdd7ae9e9f9e2ddd079c))



# 4.2.0 (2024-09-19)


### Features

* force new release ([70fe6ca](https://github.com/SUI-Components/sui/commit/70fe6caa88270e3134d1cf9cde9efa76226f3ae1))



# 4.1.0 (2024-09-19)


### Features

* add segment wrapper package ([caca7a7](https://github.com/SUI-Components/sui/commit/caca7a75de391a8a78a420226ccb363f67ae02af))
* change some names ([8123b8e](https://github.com/SUI-Components/sui/commit/8123b8ed6238bf52c84194945e5e4d87001a9f6f))
* remove umd folder ([267990d](https://github.com/SUI-Components/sui/commit/267990d9f39b654002b20c7d8b328e6a447eeebf))