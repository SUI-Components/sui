const {serverConfig} = require('../../src/config')
const {forceTranspilation = []} = serverConfig

const regexToAdd = forceTranspilation.map(
  regexString => new RegExp(regexString)
)

require('@babel/register')({
  only: [/test/, /src/, /@s-ui/, ...regexToAdd],
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
