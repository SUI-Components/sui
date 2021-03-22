const {serverConfig} = require('../../src/config')
const {forceTranspilation = [], esmOverride = false} = serverConfig

const regexToAdd = forceTranspilation.map(
  regexString => new RegExp(regexString)
)

if (esmOverride) {
  require('./applyEsmOverride')
}

require('@babel/register')({
  ignore: [],
  only: [/test/, /lib/, /src/, /@s-ui/, /@babel\/runtime/, ...regexToAdd],
  presets: [
    [
      'babel-preset-sui',
      {
        useESModules: false
      }
    ]
  ],
  plugins: [
    'babel-plugin-dynamic-import-node',
    '@babel/plugin-transform-modules-commonjs'
  ]
})
