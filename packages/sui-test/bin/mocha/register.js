const {serverConfig} = require('../../src/config.js')
const {getSWCConfig} = require('@s-ui/compiler-config')

const {forceTranspilation = [], esmOverride = false, useLibDir = false} = serverConfig
const regexToAdd = forceTranspilation.map(regexString => new RegExp(regexString))

if (esmOverride) {
  require('./applyEsmOverride.js')
}

const libDir = /lib/
const paths = [/@babel\/runtime/, /@s-ui/, /@adv-ui/, /mocks/, /src/, /test/, libDir, ...regexToAdd]
const only = useLibDir ? paths : paths.filter(path => path !== libDir)
const swcConfig = getSWCConfig({isTypeScript: true, compileToCJS: true})

// Register TS source files
require('@swc/register')({
  ignore: [/(.*)\.(js|cjs|mjs)/],
  only,
  ...swcConfig
})

// Register JS source files
require('@babel/register')({
  ignore: [/(.*)\.ts/],
  only,
  presets: [
    [
      'babel-preset-sui',
      {
        useESModules: false
      }
    ]
  ],
  plugins: ['babel-plugin-dynamic-import-node', '@babel/plugin-transform-modules-commonjs']
})
