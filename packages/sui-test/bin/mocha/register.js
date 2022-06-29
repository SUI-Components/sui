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
const paths = [
  /@babel\/runtime/,
  /@s-ui/,
  /mocks/,
  /src/,
  /test/,
  libDir,
  ...regexToAdd
]

require('@babel/register')({
  ignore: [],
  only: useLibDir ? paths : paths.filter(path => path !== libDir),
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
