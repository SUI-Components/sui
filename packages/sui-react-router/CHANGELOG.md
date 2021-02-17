# CHANGELOG

# 1.7.0 (2020-11-12)


### Features

* use new React jsx import from babel ([bb1d291](https://github.com/SUI-Components/sui/commit/bb1d29160ba9538ecb9702e22524547ef8a5c7ce))



# 1.6.0 (2020-10-23)


### Features

* support react 17 as peer dependency ([b2a22c2](https://github.com/SUI-Components/sui/commit/b2a22c2af038168242604ccb7fb87120d82d4912))



# 1.5.0 (2020-10-05)


### Features

* upgrade sui-react-router dependencies ([7ce1bd4](https://github.com/SUI-Components/sui/commit/7ce1bd46c2c89e1c72de31fedb40d2568d6d1a37))



# 1.4.0 (2020-10-02)


### Bug Fixes

* fixed Routes below a Route that use regexp ([c6d31e5](https://github.com/SUI-Components/sui/commit/c6d31e581f8aa05592f860a1fae230144238a448)), closes [#946](https://github.com/SUI-Components/sui/issues/946)



# 1.3.0 (2020-07-13)


### Features

* add regexp property to the route component ([20119f8](https://github.com/SUI-Components/sui/commit/20119f847268cc768f606490446ae9041927dc0b))
* added param groups in regex. Added tests too ([eaaa349](https://github.com/SUI-Components/sui/commit/eaaa34947595af5cca5cedd7ce3607a8cba228f5))
* allow use regexp in middle of your routes definitions ([c3da38f](https://github.com/SUI-Components/sui/commit/c3da38f27b3fef3a83930ab53b3ec8ab7a9d366e))



# 1.2.0 (2020-06-16)


### Bug Fixes

* avoid not needed re-renders ([6e4aea3](https://github.com/SUI-Components/sui/commit/6e4aea3b329fa858a17635cf1d0b184b6cc466b2))



# 1.1.0 (2020-05-21)


### Bug Fixes

* add missing support for Router working only with CSR and using correct transi ([a80e5f6](https://github.com/SUI-Components/sui/commit/a80e5f606336681fef76a425707dd7e476cd6646))
* allow import @s-ui/react-router by avoiding creation of browser history if se ([bc87f22](https://github.com/SUI-Components/sui/commit/bc87f22086571a89cb7e03405301786053fc3d5f))
* avoid browserHistory to break when imported from server ([6f6b056](https://github.com/SUI-Components/sui/commit/6f6b056014c06f779aec8ff31a8a38d58d0cc753))
* avoid exploiding if no routes matches ([16f1aec](https://github.com/SUI-Components/sui/commit/16f1aec11f03154452cf585cb658b438dd38fcfe))
* create correctly memory history without need to push urls ([c4e2c62](https://github.com/SUI-Components/sui/commit/c4e2c6231d6e470f06d6a344f566a83af8504f84))
* fix bug when no renderProps are present and is not returning a falsy value ([ea72896](https://github.com/SUI-Components/sui/commit/ea728960e0ee4890d3cae4d53390c647a981dab8))
* fix problems using React Router without match not updating state and reuse fi ([2b86b28](https://github.com/SUI-Components/sui/commit/2b86b28b047be277ce7ab68c507bfc2d10498901))
* fix Redirect not working with dynamic segments ([c2798ee](https://github.com/SUI-Components/sui/commit/c2798ee91c75400a9f238c1887432eb5eafa933f))
* fix special case ([dfbca20](https://github.com/SUI-Components/sui/commit/dfbca20efab52b4e1fdff9424480dfa447a80e54))
* fix the usage of the provider ([028c541](https://github.com/SUI-Components/sui/commit/028c54193a116942806d986e1b86314fd1f44b54))
* fix typings by returning components something ([e157e0d](https://github.com/SUI-Components/sui/commit/e157e0d5a433678018f396e8b2dc791322b8bca9))
* get last route correctly ([d2d7046](https://github.com/SUI-Components/sui/commit/d2d70462b630877d9fd27909623efafe0683d4f4))
* keep better compatibility moving PatternUtils ([33850fd](https://github.com/SUI-Components/sui/commit/33850fd6fd8690bb98b6fd851eada2c010485a66))
* merge IndexRoute with parent component ([318ac59](https://github.com/SUI-Components/sui/commit/318ac59b968f34d5ba466c5ece907f6410912ec5))
* remove eslint config from package ([0a02251](https://github.com/SUI-Components/sui/commit/0a02251cff7c15bb6782ac2582c2e2287167f9d6))
* update routes on every transition ([4481bb5](https://github.com/SUI-Components/sui/commit/4481bb53406023d9e0badbec6e1c14107cb27b1e))
* wrong import from lib folder ([c822c0e](https://github.com/SUI-Components/sui/commit/c822c0e644c23fe5a15ec214b13d91e55f31f1b5))


### Features

* add createRouterHistory depending on environment ([c48ce98](https://github.com/SUI-Components/sui/commit/c48ce988cbef8cb94e6f3202d858db8b00ba7ac4))
* add hook internally ([0f2ead8](https://github.com/SUI-Components/sui/commit/0f2ead8a43c04b5f7658f47465a1fb25b02e1e34))
* add hooks ([d9751a3](https://github.com/SUI-Components/sui/commit/d9751a31e35f62f4b342f87c2a57b0c1f7d046e1))
* add Link and Fix RenderComponents ([7441dcb](https://github.com/SUI-Components/sui/commit/7441dcb7926c7ffdd1f5ef347e57fbcc611bcb42))
* add Link documentation and document code ([9561a03](https://github.com/SUI-Components/sui/commit/9561a03ecbde772ec210987ab798a59a8ea31e1a))
* add missing injected route param ([c21cbfd](https://github.com/SUI-Components/sui/commit/c21cbfdd6f9581d962a5c0e4c0be9d2f9469bb31))
* add simpler invariant ([59e4776](https://github.com/SUI-Components/sui/commit/59e4776cdd7ae65b1039ac4c988319b380cd5c2b))
* add simpler warning ([2b5fd3b](https://github.com/SUI-Components/sui/commit/2b5fd3b1d992aa5bb0781dae13ff44019694ddb8))
* add types file ([7cd4455](https://github.com/SUI-Components/sui/commit/7cd445512862477921356b524b694a033390054b))
* avoid Link to render an empty className ([62211f1](https://github.com/SUI-Components/sui/commit/62211f13a5abb6d503ed23ab280ff5ff39da6575))
* avoid match only partial routes ([5153fe1](https://github.com/SUI-Components/sui/commit/5153fe1ecbede9df9f32c3eebb44338a62fc164b))
* better not supported props handling by IndexRoute ([f0a5d8a](https://github.com/SUI-Components/sui/commit/f0a5d8a0514aea238d351985d20958c466b5dcc1))
* better withRouter behaviour for displayName ([bbd55f1](https://github.com/SUI-Components/sui/commit/bbd55f195218c2c39577594a46a96528fb9d5531))
* bump version ([4395448](https://github.com/SUI-Components/sui/commit/4395448e774e2fd0ea9c75f77fae94d41fd365e2))
* create components ([cc7e037](https://github.com/SUI-Components/sui/commit/cc7e0376b860fa59d4337f7f9f712b9612bfec51))
* create withRouter that mimics react-router-v3 api ([a048813](https://github.com/SUI-Components/sui/commit/a048813117c2c3eb3aac477552f1ca24033ca337))
* document propTypes of IndexRoute ([dea4972](https://github.com/SUI-Components/sui/commit/dea4972289b85ddd8708aa45e028d9624eb1c6f5))
* document propTypes of Route ([1339789](https://github.com/SUI-Components/sui/commit/1339789c883dd8b4d46dd83ae129e4ec22a42f8e))
* document Redirect component ([60859d1](https://github.com/SUI-Components/sui/commit/60859d16e117ed69490080c30fb6c641227969d9))
* export hooks in index file ([0e6fe21](https://github.com/SUI-Components/sui/commit/0e6fe21e70c1f1acf356ed11fae2a542746a8c02))
* first commit ([fe778a0](https://github.com/SUI-Components/sui/commit/fe778a0c3b6041ca14527f506dd89a2f53115736))
* first iteration to get a list of components ([8186b2c](https://github.com/SUI-Components/sui/commit/8186b2ca2fc742613d17ec58b16aa3f27f48426d))
* first time rendering pages ([39dc773](https://github.com/SUI-Components/sui/commit/39dc77339f60cf158b8b08dd58fa80d52d744655))
* inject missing props to components and use correct default history ([84f1949](https://github.com/SUI-Components/sui/commit/84f19497ef69d62cab794bdabcde21e68eb68cf0))
* invariant return null for convenience ([19fa303](https://github.com/SUI-Components/sui/commit/19fa3030dd81aff03208e28699cb88c218eb7b80))
* make history optional for match as memoryHistory is used by default ([7a23d77](https://github.com/SUI-Components/sui/commit/7a23d7724f30e57412163871ce0c54c06462fe5f))
* make it a truly SPA router ([cf9df18](https://github.com/SUI-Components/sui/commit/cf9df182e67adf393521dc5439d24e7c21ca3ca0))
* mimic actual behaviour of match with default memoryHistory ([7cd4b95](https://github.com/SUI-Components/sui/commit/7cd4b95a39a7adaef49ee74c00dd5332cb084844))
* remove context not needed code ([27ed39d](https://github.com/SUI-Components/sui/commit/27ed39df30cb6a2b976085816170e975ed29609c))
* remove not used internal prop types ([ea6d154](https://github.com/SUI-Components/sui/commit/ea6d15452b6619ee436e7c7ad4bd1e783b4fb71e))
* remove routerWarning ([6a6dd59](https://github.com/SUI-Components/sui/commit/6a6dd59f216f6771607ff700ffc8779df5c91954))
* second version build renderComponents array ([310232d](https://github.com/SUI-Components/sui/commit/310232d1fe36b979eaf4967a1028dde52860e33b))
* separate in a file the canUseDom util ([c20b318](https://github.com/SUI-Components/sui/commit/c20b3181b9c43e51e32cb6462e33e38bc65faa67))
* simplify conditional on react-utils ([6426706](https://github.com/SUI-Components/sui/commit/6426706a44842c7e12415ace7cd907f07e0d91fe))
* use correct default history depending on environment ([ea727d3](https://github.com/SUI-Components/sui/commit/ea727d389b05af9826170c4ebbf035357eb05814))
* use correct Route propTypes ([04ce41f](https://github.com/SUI-Components/sui/commit/04ce41f403ffb4f85b97db9b077fc7e0f094bdc2))
* use MemoryHistory in SSR ([e9b1a0e](https://github.com/SUI-Components/sui/commit/e9b1a0eb0b1fdb23cd6c84c2bceb630372b63b02))
* use new invariant on PatternUtils and put reference to original file ([b121210](https://github.com/SUI-Components/sui/commit/b1212101b43baf34d1f45e3c52063e3eeedae53e))
* use same classnames as other packages to avoid duplicates ([9394a02](https://github.com/SUI-Components/sui/commit/9394a02c80a74763519b09bc12da5625c056f773))


### Performance Improvements

* avoid re-renderer of consumers because creating new object on every render o ([4a67f35](https://github.com/SUI-Components/sui/commit/4a67f35a31c50262d7006c0a55af5043c3d9b592))
* load from history only what is needed ([6f0e12c](https://github.com/SUI-Components/sui/commit/6f0e12c6f654892a980f449b777dd4fed92cc959))



