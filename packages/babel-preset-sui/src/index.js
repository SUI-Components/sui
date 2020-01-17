const cleanList = require('./clean-list')
const {DEFAULT_BROWSER_TARGETS} = require('./defaults')

function getTargets({targets = {}}) {
  const {browser = DEFAULT_BROWSER_TARGETS} = targets

  return browser
}

function plugins(api, opts = {}) {
  return cleanList([
    require('@babel/plugin-syntax-export-default-from').default,
    require('@babel/plugin-syntax-export-namespace-from').default,
    [require('@babel/plugin-proposal-decorators').default, {legacy: true}],
    [require('@babel/plugin-proposal-class-properties').default, {loose: true}],
    [
      require('babel-plugin-transform-react-remove-prop-types').default,
      {
        wrap: true
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
  ])
}

function presets(api, opts) {
  const {targets} = opts

  return [
    [
      require('@babel/preset-env').default,
      {
        debug: false,
        ignoreBrowserslistConfig: true,
        loose: true,
        modules: false,
        // Exclude transforms that make all code slower
        exclude: ['transform-typeof-symbol'],
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
