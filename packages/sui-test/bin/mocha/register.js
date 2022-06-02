const {serverConfig} = require('../../src/config.js')
const {
  forceTranspilation = [],
  esmOverride = false,
  useLibDir = false
} = serverConfig

const regexToAdd = forceTranspilation.map(
  regexString => new RegExp(regexString)
)

if (esmOverride) {
  require('./applyEsmOverride.js')
}

const libDir = /lib/
const paths = [/test/, libDir, /src/, /@s-ui/, /@babel\/runtime/, ...regexToAdd]

require('@babel/register')({
  ignore: [],
  only: useLibDir ? paths : paths.filter(path => path !== libDir),
  presets: [
    [
      require.resolve('babel-preset-sui'),
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
