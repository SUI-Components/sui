# CHANGELOG

# 7.19.0 (2021-02-22)


### Features

* update deps ([2824498](https://github.com/SUI-Components/sui/commit/2824498cf0d93518363af62bd5758a1154d612df))



# 7.18.0 (2021-02-19)


### Bug Fixes

* fix critical css config object ([58234f4](https://github.com/SUI-Components/sui/commit/58234f45bc407f4a9218e1f25ad2095320b27ba1))



# 7.17.0 (2021-02-15)


### Features

* add initial context value ([3987106](https://github.com/SUI-Components/sui/commit/39871062aff64ab893208d482f286cef8d220879))
* let the context providers inject data into the html ([7b9fc62](https://github.com/SUI-Components/sui/commit/7b9fc627781cf9346615302bae0f7c2b035e2b35))
* update test config + fix tests ([7c30bbc](https://github.com/SUI-Components/sui/commit/7c30bbcb74ff6bab0b87d97909d42a1e0849a19e))
* use getInitialData ([d1c248d](https://github.com/SUI-Components/sui/commit/d1c248d71b7d983f563bfc3be4e2079843462982))



# 7.16.0 (2021-02-11)


### Bug Fixes

* fix optional chaining in server code ([e531407](https://github.com/SUI-Components/sui/commit/e53140795d29f06af3eafee5f9b21ce710fce92a))



# 7.15.0 (2021-02-11)


### Bug Fixes

* fix build request url method ([f4ee1ab](https://github.com/SUI-Components/sui/commit/f4ee1abd8f65fb4711e8de3ad4310d01de391960))
* fix duplicated hyphen ([91fd5c5](https://github.com/SUI-Components/sui/commit/91fd5c5320fa10e47c472f7c07d31aec39313e3b))
* fix passed config reference ([8fdc61f](https://github.com/SUI-Components/sui/commit/8fdc61fbfef7f35c2f4d3179c926bc11fb2b6af0))
* fix some issues that were breaking the server for multi sites apps ([7fa9c8b](https://github.com/SUI-Components/sui/commit/7fa9c8b15c81ef2e2eb4320843c839ef4f081481))


### Features

* allow multiple hosts for critical css ([07f6272](https://github.com/SUI-Components/sui/commit/07f6272b5e1d5d5d9db6aaf138e34d3cf22a77bc))



# 7.14.0 (2021-01-27)


### Features

* use GITHUB_TOKEN instead GH_TOKEN to normalize but keep compatibility ([8f6b5bb](https://github.com/SUI-Components/sui/commit/8f6b5bb3c68ed2f706bee4c7c8c5a0f270b49e1c))



# 7.13.0 (2021-01-13)


### Bug Fixes

* rollback commander version to avoid clashing options names ([5642357](https://github.com/SUI-Components/sui/commit/5642357b5753aa57376088d36d42450b695461b5))



# 7.12.0 (2020-12-30)


### Features

* Use latest and same commander version and avoid installing different versions ([b90af66](https://github.com/SUI-Components/sui/commit/b90af6658d8df16348098709103a288d9b938521))



# 7.11.0 (2020-12-14)


### Bug Fixes

* modify constant naming ([f4fcf04](https://github.com/SUI-Components/sui/commit/f4fcf04f130bd777c174a66feaed9c6639fa1978))
* remove the fucking slash again ([313e7a2](https://github.com/SUI-Components/sui/commit/313e7a2c00e6eb53ac5afa28619feace78db4a72))


### Features

* update the critical css service domain ([8a72d78](https://github.com/SUI-Components/sui/commit/8a72d7810592e1e870fba5b161d6163fd52bda83))



# 7.10.0 (2020-11-24)


### Features

* remove prpl code ([ac28a31](https://github.com/SUI-Components/sui/commit/ac28a3189a2199c06565ba41c6cc1ccb76ef7fc0))
* remove prpl service usage ([c239b3f](https://github.com/SUI-Components/sui/commit/c239b3fc3b4c1f36964f3e390c4380364859a15d))



# 7.9.0 (2020-11-20)


### Bug Fixes

* fix program value ([9ce59ad](https://github.com/SUI-Components/sui/commit/9ce59ad7c238ffe2bf3f941cf5bbe42c62473a39))
* set docker registry in bin file ([5d6d515](https://github.com/SUI-Components/sui/commit/5d6d515a16234cd766ce4f1811d568e8142f1a74))
* unformat some comments in readme ([7471f14](https://github.com/SUI-Components/sui/commit/7471f14a5d64c2c4ec605f335e1d745c4629125a))


### Features

* add option to define a custom registry for the pm2 dependency ([21a7707](https://github.com/SUI-Components/sui/commit/21a77072e54f1a079defff8d643ec2f926bc6e7c))



# 7.8.0 (2020-09-15)


### Features

* convert contextProvider to factory and pass contextFactory returned value ([0ee923e](https://github.com/SUI-Components/sui/commit/0ee923ea5cd4990a80571229d2ec800dfc162b4c))



# 7.7.0 (2020-07-15)


### Bug Fixes

* add double check before find an array element ([f891491](https://github.com/SUI-Components/sui/commit/f891491e8c700bfda759a8da283926c9eccec90c))


### Features

* accept host patterns in multisite config ([0c14746](https://github.com/SUI-Components/sui/commit/0c14746bc32b17db617b88b98cd8df3f9c3b4b22))



# 7.6.0 (2020-07-06)


### Features

* add flag to define a custom entrypoint ([28dc7b7](https://github.com/SUI-Components/sui/commit/28dc7b70c2eef27e24f2f885e1ef8774aa73bcf8))
* allow use an alternative entrypoint ([2b83bf4](https://github.com/SUI-Components/sui/commit/2b83bf4e98ae1984b61699cf0d2160eb4f3f60c0))



# 7.5.0 (2020-07-06)


### Features

* avoid cache index html w/out third parties ([e1c978f](https://github.com/SUI-Components/sui/commit/e1c978f2c3f1f6c7b9c9844da4381c966b430fc0))
* dont user memoize template ([415cc95](https://github.com/SUI-Components/sui/commit/415cc9538f7407deeca14604d20c1094b5d9b8b4))
* remove 3th party scripts using an AST ([e082ae6](https://github.com/SUI-Components/sui/commit/e082ae6daa5dcc676f90b2fd5daae63af83ef9e4))



# 7.4.0 (2020-07-03)


### Bug Fixes

* fix node version to 14-alpine in dockerfile.tpl ([aa6c57d](https://github.com/SUI-Components/sui/commit/aa6c57d61169053e00e3b303c754b42876d1b451))



# 7.3.0 (2020-06-26)


### Bug Fixes

* remove double encodeURIComponent ([bb5f501](https://github.com/SUI-Components/sui/commit/bb5f501e4914160191e31d063714b2c97cd34b59))


### Features

* migrate to the new CriticalCSS URL ([95aa20e](https://github.com/SUI-Components/sui/commit/95aa20e773004281401f0d9b227a27f7d82dcd46))
* send empty object if there is not extraCustomHeaders ([c600355](https://github.com/SUI-Components/sui/commit/c60035526d0e05f5bc351bad59e38f1571e7a24a))



# 7.2.0 (2020-06-25)


### Bug Fixes

* fix possible xss ([5216b47](https://github.com/SUI-Components/sui/commit/5216b47b48aeeb496e9a5b5a620a70361026bdf3))



# 7.1.0 (2020-06-11)


### Features

* add req and response props ([d491d5b](https://github.com/SUI-Components/sui/commit/d491d5b569126d9eaa5565bf1313a16238d33e37))



# 7.0.0 (2020-05-21)


### Features

* use sui-react-router for match ([96c3e4e](https://github.com/SUI-Components/sui/commit/96c3e4e429a4bb4a20d442860d132aac714d5445))



# 6.15.0 (2020-05-08)



# 6.14.0 (2020-05-08)


### Bug Fixes

* fix error memory leak ([f5c7610](https://github.com/SUI-Components/sui/commit/f5c76104430f8aa2b4b1328c2fef619ba0247089))
* fix memory leak ([65c8958](https://github.com/SUI-Components/sui/commit/65c89581ed5767e0ebc914bad15441319832cd5d))
* fix performance issue with strings ([2e727a2](https://github.com/SUI-Components/sui/commit/2e727a256022a70cf01dec85c4eb85568aa951cb))
* fix redirect location param name ([6786f7c](https://github.com/SUI-Components/sui/commit/6786f7c3719bd978c56f847ec78ca902b415a856))
* fix string memory leak ([acf4dc6](https://github.com/SUI-Components/sui/commit/acf4dc6fed50b64109be06eedbfd0aeafe1a0cc1))



# 6.13.0 (2020-05-07)


### Bug Fixes

* fix hooks order ([e379a6d](https://github.com/SUI-Components/sui/commit/e379a6d82dc48f6b79dd649359d399fdbc00fb7c))


### Features

* activate bootstrap hook ([a0b58a5](https://github.com/SUI-Components/sui/commit/a0b58a5dfef642197e3a4c0e8414aa27d0c136f7))
* boostrap even before pre health ([eee0eeb](https://github.com/SUI-Components/sui/commit/eee0eebf7fdffb52f6491e23848a84aa637c4417))



# 6.12.0 (2020-05-07)


### Features

* add bootstrap hook type ([6fb48c0](https://github.com/SUI-Components/sui/commit/6fb48c000b8a89c9a582d7b7c160ac8af302d0ea))
* add timing to context and route matching hooks ([454b19f](https://github.com/SUI-Components/sui/commit/454b19fa5bf98946a77a90aa97cc8517f5cdfafa))
* get match props from req and add timing in criticalCSS middleware ([5b5db82](https://github.com/SUI-Components/sui/commit/5b5db82d0126b431dea00f40a0ae3af644e409c9))
* get match props from req and add timing in prpl middleware ([8e40376](https://github.com/SUI-Components/sui/commit/8e403769ab3e2ae62392e79e20aeff18170a0cf2))
* move hrtimeToMs to utils module ([c3865c4](https://github.com/SUI-Components/sui/commit/c3865c4b0f1705497f817c772c88d9ce5a8092f2))
* move req prop destructuring to top, return all timing info ([e6f8795](https://github.com/SUI-Components/sui/commit/e6f8795e659bf18d16779c9ebe1eb6b33239dfc7))



# 6.11.0 (2020-05-05)


### Bug Fixes

* remove unused bootstrap hook type ([ca31f7e](https://github.com/SUI-Components/sui/commit/ca31f7ebf65606848d1d2497d6b1bd4986e65b38))


### Features

* add config for env and mandatoryCSSRules check for criticalCSS ([585dbd8](https://github.com/SUI-Components/sui/commit/585dbd8ec57b76e7974f45275229cdcde04e8ce7))
* add max retrys by hash logic ([1707518](https://github.com/SUI-Components/sui/commit/17075188f582c325af7203f55546639c1beb01ce))
* code doc and logMessages ([ebdf251](https://github.com/SUI-Components/sui/commit/ebdf251b53c29304593adb9fe61b9dbd0b466e5a))
* exit process if no routes file found ([487705d](https://github.com/SUI-Components/sui/commit/487705d0f3be53cc3b41a9155e794a4eceae6a71))
* manage errors first in ssr, before redirects ([8f6ccf6](https://github.com/SUI-Components/sui/commit/8f6ccf61e1cdbd53447ebfbcdce13c96a70c200b))
* rename BOOTSTRAP hook to ROUTE_MATCHING ([475c885](https://github.com/SUI-Components/sui/commit/475c885173057f7bc53283c07370ad62d2b54f08))
* retrieve critical and prpl middlewares ([a8eb072](https://github.com/SUI-Components/sui/commit/a8eb072c157a1c15f8ad915011a34c3aa23f0a0b))
* retrieve server getInitialProps & render metrics ([cf72604](https://github.com/SUI-Components/sui/commit/cf7260486cd89ec9525b1a8fb311e171897bd86f))
* use sui-react-router in prpl ([624b61d](https://github.com/SUI-Components/sui/commit/624b61d82fc9e288382f085be013a1a72a73630f))



# 6.10.0 (2020-05-04)


### Bug Fixes

* route.path fix ([921e721](https://github.com/SUI-Components/sui/commit/921e721c9073bc62c015abde374f9e1fc0c9b90c))


### Features

* add blackListRoutePaths cheking in criticalCSS and prpl ([8a0634e](https://github.com/SUI-Components/sui/commit/8a0634e1d1fa68168edaecf45ce8399846b514e5))
* add bootstrap hook ([67ed9b7](https://github.com/SUI-Components/sui/commit/67ed9b724628039a80fa00d0df26c4694a1d56a2))
* remove match() from main ssr and move to bootstrap hook ([b90de60](https://github.com/SUI-Components/sui/commit/b90de601a225c2c74f1679044291b019c568148b))



# 6.9.0 (2020-04-27)



# 6.8.0 (2020-04-27)


### Features

* context providers as plugins ([2a57992](https://github.com/SUI-Components/sui/commit/2a57992453ab07884bba2bbdcd81a69c16f006cf))
* use logMessage instead of console ([ff9c38c](https://github.com/SUI-Components/sui/commit/ff9c38cb9257e1444b64c45098e4be6454e0134b))



# 6.7.0 (2020-04-24)


### Features

* add criticalCSS invalidate param ([71aa60d](https://github.com/SUI-Components/sui/commit/71aa60d5793420ad59584eddcbc416b345bfe6db))
* improve logging and config ([6be9929](https://github.com/SUI-Components/sui/commit/6be9929fa6b20ee57b12fcd569b2a218a8d42584))
* log message in console when critical css is invalidated ([9bdbe6c](https://github.com/SUI-Components/sui/commit/9bdbe6cdc38ba62e4956a9cedda3517971a50696))



# 6.6.0 (2020-04-23)


### Features

* send hints preload with headers ([8c6a349](https://github.com/SUI-Components/sui/commit/8c6a3498ad0a62af580eb8e452c8d315856dee60))



# 6.5.0 (2020-04-23)


### Features

* add support for the prpl service ([6e60e5b](https://github.com/SUI-Components/sui/commit/6e60e5bef8aba66c5f26ebe6d7ed9cad066eb1a3))
* mobile as default prpl device ([820e79f](https://github.com/SUI-Components/sui/commit/820e79fa534715f1b443062387ba3e760af83a62))
* remove development mode ([302aee4](https://github.com/SUI-Components/sui/commit/302aee4b6f253431dbae8a9a6f940e411425a522))
* use default history and pass location instead pushing it ([d004a55](https://github.com/SUI-Components/sui/commit/d004a557eb8811f8cdc0cafbb12029d6f17d637e))



# 6.4.0 (2020-04-17)


### Features

* use parse to improve JSON ([2ea0d3f](https://github.com/SUI-Components/sui/commit/2ea0d3fd74b72a7eba034b636b3367b669da456a))



# 6.3.0 (2020-03-31)


### Features

* use skipSSR flag instead of checking status code to skip ssr ([67cc137](https://github.com/SUI-Components/sui/commit/67cc137737b1b52c0fab86841669acbdab5eb16c))



# 6.2.0 (2020-03-31)


### Features

* add check to skip ssr if statusCode is set to 404 ([3e8eb55](https://github.com/SUI-Components/sui/commit/3e8eb5507a0dc9494ac8759bf15f3eee169e5f80))
* add new SETUP_CONTEXT hook default function in hooksFactory ([b0aed96](https://github.com/SUI-Components/sui/commit/b0aed965f38845ce8b4383a779b5100ca7b7cdd3))
* add new setup_context hook to hook types file ([aa96126](https://github.com/SUI-Components/sui/commit/aa96126ec30a2bfd7eddfbe2a48f3e646740d765))
* add new SETUP_CONTEXT middleware in ssr server ([5d27850](https://github.com/SUI-Components/sui/commit/5d278504da3b82ce0008b6eb5dc9b683e0465d4e))
* use @s-ui/react-router for criticalcss ([7ea27dd](https://github.com/SUI-Components/sui/commit/7ea27dd6aa12001e9013fe26b83a18348ac5ec04))
* use request context instead of building it in ssr ([e8d62e8](https://github.com/SUI-Components/sui/commit/e8d62e874ced922b414a19b202d58a5ebd298b43))



# 6.1.0 (2020-03-17)


### Bug Fixes

* remove JSX from the server code ([0f96456](https://github.com/SUI-Components/sui/commit/0f9645602a8e41b9c5b0d92a74b468838da2ec9f))



# 6.0.0 (2020-03-17)


### Bug Fixes

* use a static version of the history ([21e020a](https://github.com/SUI-Components/sui/commit/21e020ae694fd6605fd8f3c487543529148aee4d))


### Features

* add @s-ui/react-head dependency ([6114f71](https://github.com/SUI-Components/sui/commit/6114f712d9a195accf39844ab8157807330f9f0b))
* migrate to @s-ui/react-head ([6f92990](https://github.com/SUI-Components/sui/commit/6f929905a2ddfbd6d9608f78f0310d7770eb72a7))


### BREAKING CHANGES

* To put html tags in your headers you MUST use the package @s-ui/react-head



# 5.35.0 (2020-02-26)



# 5.34.0 (2020-02-26)


### Features

* add flag --link-package to build task ([6459226](https://github.com/SUI-Components/sui/commit/64592260249a26ecc9a66003f586b6fad5de95b7))
* priorize head tag load for improve SEO ([dbc4996](https://github.com/SUI-Components/sui/commit/dbc49964ddf330e5c83c2c240609915c4b492241))



# 5.33.0 (2019-12-20)


### Bug Fixes

* send custom headers properly inside an options object ([1cacef4](https://github.com/SUI-Components/sui/commit/1cacef465f24b2b482482be0ae457681c0498982))


### Features

* sui-ssr expect works with @s-ui/react-router ([86c32bd](https://github.com/SUI-Components/sui/commit/86c32bdec5a244a92ee4864bd93f27f23f941dc0))
* use Router component and split requires ([3ac23e8](https://github.com/SUI-Components/sui/commit/3ac23e84b9f713ea85eb8cfd71843a2ccdcac245))


### BREAKING CHANGES

* Internal requirement path changes from react-router to @s-ui/react-router, break the convention.



# 5.32.0 (2019-12-19)


### Bug Fixes

* avoid using the same name for different variables ([2001341](https://github.com/SUI-Components/sui/commit/20013412dc3e1780e7d2b973c088d0201d29a637))



# 5.31.0 (2019-12-19)


### Features

* allow sending custom headers to critical css service ([03e7974](https://github.com/SUI-Components/sui/commit/03e7974059e3230dff9865f2e53985b5c6f8ed13))



# 5.30.0 (2019-10-24)


### Features

* stop branching our code for using default values ([9c52993](https://github.com/SUI-Components/sui/commit/9c52993dfecb35cafc5d9e6d6564dbd9e6bc4c7c))



# 5.29.0 (2019-10-22)


### Bug Fixes

* fix undefined verification ([72ff69e](https://github.com/SUI-Components/sui/commit/72ff69ecc3990acf8dbb75c360f74cf46fc74992))


### Features

* added configuration to set the server content-type ([3217140](https://github.com/SUI-Components/sui/commit/3217140dd08bd20f4d5c370d6b8d6a7363f6a896))



# 5.28.0 (2019-10-08)


### Features

* remove CriticalCSS after load styles ([2d7c061](https://github.com/SUI-Components/sui/commit/2d7c06108d432415e90c49e0c17c6a8b7c91f165))



# 5.27.0 (2019-10-03)


### Bug Fixes

* fix criticalCSS URL ([ba8c926](https://github.com/SUI-Components/sui/commit/ba8c9269cef7420d17ef8e54d000ba93af7d3270))



# 5.26.0 (2019-10-03)


### Bug Fixes

* moves earlyFlush invocation after res.redirect to avoid crashes ([92a7ae3](https://github.com/SUI-Components/sui/commit/92a7ae3a8d46113b7d0090a5dcf61cd1b6f1b2b8))
* typo in comment ([7001fda](https://github.com/SUI-Components/sui/commit/7001fda95abd766591e63a2cbc7a332d2b71cd7b))



# 5.25.0 (2019-10-02)


### Features

* adds a key to allow 301 redirects in server ([8760da6](https://github.com/SUI-Components/sui/commit/8760da6f4f8c63788b4975187dc69bdf8b27ea0c))



# 5.24.0 (2019-09-30)


### Features

* restore package name ([972421c](https://github.com/SUI-Components/sui/commit/972421c6dd53ef0ce52e8a8c56fa1bd4e504a21b))



# 5.23.0 (2019-09-27)


### Features

* add PRE_SSR_HANDLER hook ([e5597a1](https://github.com/SUI-Components/sui/commit/e5597a121e5d37f372c7df1c31dbc758556d1e30))
* bump version ([1a5c5c3](https://github.com/SUI-Components/sui/commit/1a5c5c31289733613b5ed9908d6d211a5f921b79))
* update deps ([4122711](https://github.com/SUI-Components/sui/commit/41227112fd825ba814c0b9574163aaa5b3d06c70))



# 5.21.0 (2019-07-03)


### Bug Fixes

* pass device to the context ([adec3d1](https://github.com/SUI-Components/sui/commit/adec3d18ece1bc653e1ce59a34a87a43e13032f9))



# 5.20.0 (2019-06-13)


### Features

* remove now config ([b1e84aa](https://github.com/SUI-Components/sui/commit/b1e84aac0597ecae424a8ca851653114778d4309))



# 5.19.0 (2019-06-11)


### Bug Fixes

* remove console logs when generate the zip file ([5187023](https://github.com/SUI-Components/sui/commit/5187023febdbe1fdc38e7a56d65bfa0a9c63422b))



# 5.18.0 (2019-06-03)


### Bug Fixes

* make memoized html template be always an object ([d5c0ebc](https://github.com/SUI-Components/sui/commit/d5c0ebc2b06902db8688d3f71d2d2f34c122a930))



# 5.17.0 (2019-05-29)


### Features

* add pre health check hook ([aba2105](https://github.com/SUI-Components/sui/commit/aba210506d0cb5e07c017279f1ac0a5abd8ea9a8))



# 5.16.0 (2019-05-27)


### Bug Fixes

* fix docs ([de3959d](https://github.com/SUI-Components/sui/commit/de3959dfee46fa2702252975140b48b50ededc6b))
* implement improvement suggestions ([b0dbb4c](https://github.com/SUI-Components/sui/commit/b0dbb4c24e1c7edf4a0a10a06e23a55f72ce268a))
* only assign middlewares if multisite is set ([924bb69](https://github.com/SUI-Components/sui/commit/924bb69ac436b66a4487caa75f3fd47fc0d3b99f))
* remove not needed config data and fix some issues ([20687f0](https://github.com/SUI-Components/sui/commit/20687f0473c2465bc1a15437473915a589c06f14))


### Features

* add support for multisite ([5e01cfd](https://github.com/SUI-Components/sui/commit/5e01cfd92e76dae6e3fe85c1b3a960a26b6b8431))
* update docs and remove an eslint comment ([ae3bfdd](https://github.com/SUI-Components/sui/commit/ae3bfddccba55bc29d745b6a9d4e5f0b8ed3ec2b))



# 5.15.0 (2019-05-15)


### Features

* add blackListURLs config to avoid critical CSS in some urls ([471cfb1](https://github.com/SUI-Components/sui/commit/471cfb160a8f03c020b060f9742acff03f8cd1c8))



# 5.14.0 (2019-04-30)


### Features

* add PRE_STATIC_PUBLIC hook ([f0d1832](https://github.com/SUI-Components/sui/commit/f0d1832b0f770145d24dad87ee72c342ec035c1b))



# 5.13.0 (2019-04-18)


### Features

* add option to only use new react context api ([bae9c22](https://github.com/SUI-Components/sui/commit/bae9c2275907d3557ed7596c1adf1bdd9184aa10))
* log error if there is any logger in the request ([2eb7037](https://github.com/SUI-Components/sui/commit/2eb7037abac20724a5634bd80b03f2a2ed88bf54))



# 5.12.0 (2019-04-05)


### Features

* bump version ([ef7d72f](https://github.com/SUI-Components/sui/commit/ef7d72f963abf9d5fae9e6c90ced262ee4b9e0df))
* force to recreate package-lock in each release ([97ac118](https://github.com/SUI-Components/sui/commit/97ac118e964ba691f31fa11e5f1b8bc05be24aee))



# 5.10.0 (2019-04-03)


### Features

* change release msg ([6c9e50d](https://github.com/SUI-Components/sui/commit/6c9e50db281bb19b2e12b88d0fc8e0a08487a6cb))



# 5.9.0 (2019-03-25)


### Features

* bump version ([d30a85e](https://github.com/SUI-Components/sui/commit/d30a85edd759b55ec2004259850ddb537addd363))



# 5.8.0 (2019-03-25)


### Features

* add release task ([a71b6ca](https://github.com/SUI-Components/sui/commit/a71b6ca0c7d53ab1e551d2acb8b293a01268ce61))
* create Release task ([e5833a5](https://github.com/SUI-Components/sui/commit/e5833a5f5a7f2a3e881d979b0d0a0759025dbdbd))



# 5.8.0 (2019-03-11)


### Features

* console errors in non production env ([59eea5f](https://github.com/SUI-Components/sui/commit/59eea5fba1dcab9cf6f2e0b439f46c218e2972f8))



# 5.7.0 (2019-03-11)


### Features

* dont cache errors ([815bf3f](https://github.com/SUI-Components/sui/commit/815bf3f79a8049f38bfc495c9c56e870b9c6784d))



# 5.6.0 (2019-03-06)


### Features

* disable critical css by env var ([1debbf7](https://github.com/SUI-Components/sui/commit/1debbf77d83894a5d27c626c79ee3743f1737903))



# 5.5.0 (2019-03-06)


### Features

* move polyfill to function generator ([3142761](https://github.com/SUI-Components/sui/commit/3142761d84e2fcc02ddacef40ebc9d69c75c6d8d))
* remove polyfill file ([57a655b](https://github.com/SUI-Components/sui/commit/57a655b15d374e6e6acff65b264a14687885c85b))
* using the new critical css service and prefetch polyfill ([1f3d806](https://github.com/SUI-Components/sui/commit/1f3d806a201eb1af288aab9327423bb853a69943))



# 5.4.0 (2019-03-01)



# 5.3.0 (2019-02-28)


### Bug Fixes

* add device to the hash ([266b967](https://github.com/SUI-Components/sui/commit/266b967cc9921317e395febfe0c4113bbe529e1c))


### Features

* add criticalCSS feature ([7a77098](https://github.com/SUI-Components/sui/commit/7a77098e5559266b2b86a04f7a5d290ed4bce7c8))
* add GZip compression to the responses ([9de19e5](https://github.com/SUI-Components/sui/commit/9de19e5ce70c1055f44cc3b8062902ffe317f2f9))
* first version of critical css ([4af2f87](https://github.com/SUI-Components/sui/commit/4af2f87438f247a5d49f5b418711beedfa0ab750))



# 5.2.0 (2019-01-18)



# 5.1.0 (2019-01-18)


### Bug Fixes

* fix babel preset issue by removing static instruction ([d4c3618](https://github.com/SUI-Components/sui/commit/d4c3618bf48c1fd90ec43701d9494358039d32d7))
* send Content-Type header setup to HTML when respond with SPA option ([4c7f3d5](https://github.com/SUI-Components/sui/commit/4c7f3d5b6549e5f358fae8168d100e07f19e65ed))



# 5.0.0 (2019-01-18)


### Features

* add dummy commit to force release after merge master ([5ba5a73](https://github.com/SUI-Components/sui/commit/5ba5a732d3d3d723d17a4f1959a3265bb2faf212))


### BREAKING CHANGES

* default hook behaviour has changed



# 3.1.0 (2019-01-17)


### Features

* add Dynamic Rendering by pages ([18aa35a](https://github.com/SUI-Components/sui/commit/18aa35a096271eec8b3fb46f1dd930afbc3e4f1f))
* add flags for enabling/disbaling early-flush and load-spa-on-not-found ([c0f3272](https://github.com/SUI-Components/sui/commit/c0f327263b06e52f48cc9a151dfca6985c913692))
* be able to return spa on 404 error including appConfig and error message. Centralize ([4e6a91b](https://github.com/SUI-Components/sui/commit/4e6a91b2a80cd28d08651a593aa318a7a5f7d2e3))


### BREAKING CHANGES

* default hook behaviuor has been modified



# 3.0.0 (2019-01-14)


### Features

* delay early flush in order to properly handle getInitialProps exception ([3eb5022](https://github.com/SUI-Components/sui/commit/3eb50222dea1bbc6eafb7ce165f336acd9170605))
* use as peerDependency latest sui-bundler ([bb9e616](https://github.com/SUI-Components/sui/commit/bb9e616cdcbd0c23fae0144cf999b14fedfa244c))
* use new sui-bundler beta ([825733c](https://github.com/SUI-Components/sui/commit/825733c28f59c99d91b22fd28934c547f2841ef8))


### BREAKING CHANGES

* Use new sui-bundler that uses latest babel@7, so some breaking could happen
* Using new sui-bundler version with breaking changes



# 2.12.0 (2019-01-07)


### Features

* use latest features and force docker type deployment ([0dd97d0](https://github.com/SUI-Components/sui/commit/0dd97d02bea15082c5a30dc9739854dc7ba85fb6))



# 2.11.0 (2018-10-24)


### Bug Fixes

* build device haven\'t been transpiled in web app and was generating a bundle error in ([f1ca65a](https://github.com/SUI-Components/sui/commit/f1ca65ab08249fc60d577883fc9503fccaf8be5d))
* from es6 to es5, haven't been transpiled in web app ([6452c02](https://github.com/SUI-Components/sui/commit/6452c02ac8bd2c111fd517615aaea10284e855dc))



# 2.10.0 (2018-10-15)


### Bug Fixes

* fix copy of package.json inside Dockerfile ([454dd2f](https://github.com/SUI-Components/sui/commit/454dd2f837db700ab52ddd18001d903148d6e344))



# 2.9.0 (2018-10-11)


### Features

* bump version ([72d5aec](https://github.com/SUI-Components/sui/commit/72d5aec595548e0cfa4ecabab6a80c2f4375d8f8))



# 2.8.0 (2018-10-11)


### Features

* add dinamyc rendering ([51b1139](https://github.com/SUI-Components/sui/commit/51b11390d93a1c13811111289e4a2c165f7abfa2))
* fix typo ([ec86fcb](https://github.com/SUI-Components/sui/commit/ec86fcb3835cd8e2b5ad2d0cf2b0faabceed55a7))
* redirect from site.com to www.site.com ([8e846b1](https://github.com/SUI-Components/sui/commit/8e846b18285b1f95f362b35d219a0b7528eef723))



# 2.7.0 (2018-10-09)


### Features

* avoid logging health check ([2999e79](https://github.com/SUI-Components/sui/commit/2999e7947b37731386b55c13dabd2205bb75e59b))



# 2.6.0 (2018-10-03)


### Features

* hook user could be an async func ([afb112a](https://github.com/SUI-Components/sui/commit/afb112ab757f2326cce727232ac969a974c58502))



# 2.5.0 (2018-09-28)


### Bug Fixes

* use max number of cpus ([f53cb3d](https://github.com/SUI-Components/sui/commit/f53cb3d7e6683dbd662418b989eda96d4fe68514))



# 2.4.0 (2018-09-19)



# 2.3.0 (2018-09-14)


### Features

* add comments ([6bbe58d](https://github.com/SUI-Components/sui/commit/6bbe58d1fc5923d0cb40771a7e2c202b049166c3))
* add Device to context ([ff5cd66](https://github.com/SUI-Components/sui/commit/ff5cd66d8f56558dec95730c0ce8cfeb5d542126))
* change device API ([5f8e3ba](https://github.com/SUI-Components/sui/commit/5f8e3bafe8fac6c26139a51dd823c77b9b8a69d9))
* keep backward compatibility by adding a try-catch when reading envs file so that it d ([e63ce1b](https://github.com/SUI-Components/sui/commit/e63ce1baa0455b601326a5a17642d20316154ca0))
* read public env config from public-env.yml file. Build app config object and attach i ([567eb84](https://github.com/SUI-Components/sui/commit/567eb84f6f0a24f93d953e703f68ae938f4efc17))



# 2.2.0 (2018-08-27)


### Features

* add hooks feature ([1790a2c](https://github.com/SUI-Components/sui/commit/1790a2ca95d2573f5efddcea616195908eb6d505))
* remove 200.html and fix readme ([8d989eb](https://github.com/SUI-Components/sui/commit/8d989ebc607df40353db59e1df426c1958f33277))



# 2.1.0 (2018-08-21)


### Bug Fixes

* avoid prompt user and pass in the health check ([fdb96ac](https://github.com/SUI-Components/sui/commit/fdb96acaa3a715774b284ff8f38be5c01df7273f))



# 2.0.0 (2018-07-09)


### Features

* added auth system to our express build. ([52cfb66](https://github.com/SUI-Components/sui/commit/52cfb6638c42afdddd707d39abb87697ea8ed712))
* added custom name feature ([4aae7fc](https://github.com/SUI-Components/sui/commit/4aae7fc41e76fe99918d9ae5a9f4e1a8a2b65faa))
* added descriptive logs ([c6f97a0](https://github.com/SUI-Components/sui/commit/c6f97a0e4d5e841f7a5a5afd3b855ce0f462d3d8))
* added kb info on zip ([9472cc9](https://github.com/SUI-Components/sui/commit/9472cc9dd2edfdb2e0cb4ebcdcc80930336b80fe))
* added KB to sui-ssr ([78f8202](https://github.com/SUI-Components/sui/commit/78f82028382790da8aee064fb3278a93663c613d))
* bump version to major. ([db9bd4a](https://github.com/SUI-Components/sui/commit/db9bd4ade9441791525d274a4441466b7ee260a2))
* changed the way that we create files. Now we create the files with a name -sui-ssr su ([1a2fcd4](https://github.com/SUI-Components/sui/commit/1a2fcd4653cb8953c278628286e4a7cc3177ffa6))
* improved readme for the archive command ([fbaf1b2](https://github.com/SUI-Components/sui/commit/fbaf1b23fc717f10c040e6656adbcf65d48f6f3a))
* increase a minor in order to change version to 2.0 ([87875f5](https://github.com/SUI-Components/sui/commit/87875f585f89ec13af7ce65f1c2a2b54109c5c3c))


### BREAKING CHANGES

* - We've change the way in what the output of the file works



# 1.8.0 (2018-06-18)


### Features

* fix an error that was causing a false no renderProps error on our ssr server ([0a5c4c7](https://github.com/SUI-Components/sui/commit/0a5c4c704ac5baf10feebe03a2370035b5ae0dd4))



# 1.7.0 (2018-04-12)


### Features

* add very basic health check end point ([ce6b2c3](https://github.com/SUI-Components/sui/commit/ce6b2c31e38e1348191e37b973916e4a6aac753f))



# 1.6.0 (2018-04-11)


### Features

* add to the footer a performance object ([3bfe877](https://github.com/SUI-Components/sui/commit/3bfe87737fc607e4312d31287b8e7fb287c48e23))



# 1.5.0 (2018-04-09)


### Features

* add Docker to archive ([c4ba159](https://github.com/SUI-Components/sui/commit/c4ba159413dc55af4489b102539c3e1fbfafcfed))
* improve TTFB ([4b49c47](https://github.com/SUI-Components/sui/commit/4b49c4798bfdaf13d1186195c0e019f3166df9d8))


### Performance Improvements

* reade the index.html just on boot time ([e07bf68](https://github.com/SUI-Components/sui/commit/e07bf68be3544bd22527633da4c3543a1a7baf93))



# 1.4.0 (2018-04-04)


### Features

* contextFactory now is optional ([d7633be](https://github.com/SUI-Components/sui/commit/d7633be1c665d95d3ba8979df0c9af9baa77ac57))



# 1.3.0 (2018-04-04)


### Features

* bump version ([374270b](https://github.com/SUI-Components/sui/commit/374270b453d5acd317594b940ca7ae4aed66cbc5))



# 1.2.0 (2018-04-04)


### Features

* add archive command and change output folder from .server to server ([30e7478](https://github.com/SUI-Components/sui/commit/30e7478b7c92a464593dcd2560162d831ec69d7a))
* beta version ([dfbf09c](https://github.com/SUI-Components/sui/commit/dfbf09c6182e1ee88444686ffdd16b2c09659c8c))
* contextify the response ([9f31305](https://github.com/SUI-Components/sui/commit/9f31305e5eb9d190b8400b0d3730b057ff9441bd))
* frist commit ([cf8a577](https://github.com/SUI-Components/sui/commit/cf8a577c94a2cdf11783fe186746b9727c115942))



# 1.2.0 (2017-09-21)


### Features

* Move package from [@schibstedspain](https://github.com/schibstedspain) scope to [@s-ui](https://github.com/s-ui) org ([1491650](https://github.com/SUI-Components/sui/commit/14916505da5d8ecb4c4358b4a615bc369bafe5d3))



# 1.1.0 (2017-08-02)


### Features

* add package.json ([d1495ce](https://github.com/SUI-Components/sui/commit/d1495ce76b02d906ca512f59518737411a67acc1)), closes [#67](https://github.com/SUI-Components/sui/issues/67)



