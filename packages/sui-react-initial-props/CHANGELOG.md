# CHANGELOG

# 2.12.0 (2020-12-21)


### Bug Fixes

* set isLoading to true before gettingInitialProps ([7e18344](https://github.com/SUI-Components/sui/commit/7e18344cb554e1f611d408e2bb10df63d7ae20a7))
* update isLoading only if needed ([f7e2060](https://github.com/SUI-Components/sui/commit/f7e2060f89d98b120504008bc80da24fd62b6831))


### Features

* add possibility to keep mounted the component ([e1a0712](https://github.com/SUI-Components/sui/commit/e1a0712af015ad2d6149f712c3354052659eea59))



# 2.11.0 (2020-10-23)


### Features

* support react 17 as peer dependency ([bf8d9d9](https://github.com/SUI-Components/sui/commit/bf8d9d9d26d1cf214b3b82d37741c3665625e8e0))



# 2.10.0 (2020-06-11)


### Features

* add req and res props to be available in getInitialProps ([66fd8dd](https://github.com/SUI-Components/sui/commit/66fd8dda7799b723b3da7716b7c111f1c16e0da6))



# 2.9.0 (2020-04-17)


### Features

* add context and routeInfo the Page.renderLoading ([0c1ad80](https://github.com/SUI-Components/sui/commit/0c1ad80bcb4c769ff0768a6e2e5434b27c7f798b))



# 2.8.0 (2020-01-17)


### Bug Fixes

* getInitilaProps only on mount ([66b95cc](https://github.com/SUI-Components/sui/commit/66b95ccd221c76770d44c8c68494d38109d6936a))
* initial state for loading is true ([5946e95](https://github.com/SUI-Components/sui/commit/5946e952a13b09fdb5313349c38fecc94018dfb9))


### Features

* improve code readability ([1a4fa8c](https://github.com/SUI-Components/sui/commit/1a4fa8c2fa1d86eaf63831fdb8551a892fda2cdf))
* remove console.log and avoid using delete because deoptimizations ([cd013a7](https://github.com/SUI-Components/sui/commit/cd013a7a5bb6cf912447cbdc5084aa93b450a080))
* remove not needed sui-hoc dependency ([244aa99](https://github.com/SUI-Components/sui/commit/244aa9985148918de53b9e099f1b31531ce4d735))
* use new context ([80b2c84](https://github.com/SUI-Components/sui/commit/80b2c8489045b6cde499448cc2be92c9d110dcf3))



# 2.7.0 (2019-03-25)



# 2.6.0 (2019-03-19)


### Bug Fixes

* fix export syntax. ([70901c4](https://github.com/SUI-Components/sui/commit/70901c434ffde759c8f0d1f21841db755adc1362))



# 2.5.0 (2019-03-18)


### Bug Fixes

* Release library with correct babel-preset-sui installed ([512594e](https://github.com/SUI-Components/sui/commit/512594e9d7012adfe8bf27a6653aed960c73dc30))



# 2.4.0 (2019-03-18)


### Features

* Move to babel-preset-sui@3 ([b418090](https://github.com/SUI-Components/sui/commit/b41809072388844b183fe6f7094a2776ed7bb9ee))



# 2.3.0 (2019-02-19)


### Bug Fixes

* Use local babel-preset-sui for each project ([70793f6](https://github.com/SUI-Components/sui/commit/70793f63ed94f577647ec5aa38f7795945ee17b5))



# 2.1.0 (2019-02-12)


### Features

* support React Stream ([a84968b](https://github.com/SUI-Components/sui/commit/a84968b03eb391e9772f4ebf091225610d828faa))



# 2.0.0 (2019-01-18)


### Features

* catch getInitialProps error and add it to initialProps as property ([fc80084](https://github.com/SUI-Components/sui/commit/fc800846629dfa4c63c90b44eb0dcefd4878dbb4))
* force release after merge master with minor change ([1f754ec](https://github.com/SUI-Components/sui/commit/1f754ec59bcbbe7eac81a67d5cf477ce0238a819))


### BREAKING CHANGES

* change behaviour of withInitialProps



# 1.8.0 (2019-01-10)


### Features

* add displayName for server component ([3cae6b3](https://github.com/SUI-Components/sui/commit/3cae6b390099bad1323312fe059cd65e4e173d31))



# 1.7.0 (2018-09-19)


### Features

* add appConfig to context factory params ([7617c7c](https://github.com/SUI-Components/sui/commit/7617c7c4bf706effa581bcaa0030d61539b0807b))



# 1.6.0 (2018-04-11)


### Features

* add server performance metrics ([e1750b3](https://github.com/SUI-Components/sui/commit/e1750b3ef63418e55a65458fab6b83c73d9236ed))



# 1.5.0 (2018-04-04)


### Bug Fixes

* use promise and remove async function ([456e48f](https://github.com/SUI-Components/sui/commit/456e48ff511bd40f5dde84f0ed12a91933c5ee2a))


### Features

* option getInitialProps in ssr too ([f77caf2](https://github.com/SUI-Components/sui/commit/f77caf24bede6a056f79a3057dafc56fa6a971dc))



# 1.4.0 (2017-11-06)


### Features

* use prop-types library ([0a05b09](https://github.com/SUI-Components/sui/commit/0a05b099023f350e8bed93e97f9a84e42a45330c))



# 1.3.0 (2017-09-21)


### Features

* Move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([8e2e082](https://github.com/SUI-Components/sui/commit/8e2e082a7d6ea27d99fc3394b05575fe81f9143b))



# 1.2.0 (2017-08-09)


### Bug Fixes

* add missing main on package.json ([d5abe46](https://github.com/SUI-Components/sui/commit/d5abe46e7c360ea6bf9ed1548f8923336d97ae12))



# 1.1.0 (2017-08-09)


### Bug Fixes

* use new syntax as a HoC and add README ([1754b78](https://github.com/SUI-Components/sui/commit/1754b78bf6be45e58a037c67bdb810cbf79686e3))


### Features

* add some useful params and improve readability ([1e0d658](https://github.com/SUI-Components/sui/commit/1e0d65802084337a04c426435914aca99b9378a6))
* create sui-react-initial-props first version ([1201321](https://github.com/SUI-Components/sui/commit/1201321e4a1969ef32a7dfa3bbd71dbcfc657123))
* redefine the HoC and add missing dependency ([8ec10d7](https://github.com/SUI-Components/sui/commit/8ec10d701dede89bc89af86559141ddca6f0053b))



