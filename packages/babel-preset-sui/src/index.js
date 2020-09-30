const {DEFAULT_BROWSER_TARGETS} = require('./defaults')

const getTargets = ({targets = {}}) => {
  const {browser = DEFAULT_BROWSER_TARGETS} = targets
  return browser
}

const plugins = (api, opts = {}) => [
  require('babel-plugin-preval'),
  require('@babel/plugin-syntax-export-default-from').default,
  require('@babel/plugin-syntax-export-namespace-from').default,
  [require('@babel/plugin-proposal-decorators').default, {legacy: true}],
  [require('@babel/plugin-proposal-class-properties').default, {loose: true}],
  [
    require('babel-plugin-transform-react-remove-prop-types').default,
    {
      removeImport: true
    }
  ],
  [
    require('@babel/plugin-transform-runtime').default,
    {
      corejs: false,
      useESModules: true,
      regenerator: true
    }
  ]
]

const presets = (api, opts = {}) => {
  const {targets} = opts

  return [
    [
      require('@babel/preset-env').default,
      {
        debug: false,
        exclude: ['transform-typeof-symbol'], // Exclude transforms that make all code slower
        ignoreBrowserslistConfig: true,
        loose: true,
        modules: false,
        targets: getTargets({targets}),
        useBuiltIns: false
      }
    ],
    [require('@babel/preset-react').default, {useBuiltIns: true}]
  ]
}

module.exports = (api, opts) => ({
  presets: presets(api, opts),
  plugins: plugins(api, opts)
})
