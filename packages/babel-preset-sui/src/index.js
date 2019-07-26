const cleanList = require('./clean-list')
const {
  DEFAULT_BROWSER_TARGETS,
  SELECTIVE_LOOSE_REACT_HOOKS
} = require('./defaults')

function getTargets({targets = {}}) {
  const {browser = DEFAULT_BROWSER_TARGETS} = targets

  return browser
}

function plugins(api, opts = {}) {
  return cleanList([
    require('@babel/plugin-syntax-dynamic-import').default,
    require('@babel/plugin-syntax-export-default-from').default,
    require('@babel/plugin-syntax-export-namespace-from').default,
    require('@babel/plugin-proposal-optional-chaining').default,
    [require('@babel/plugin-proposal-decorators').default, {legacy: true}],
    [require('@babel/plugin-proposal-class-properties').default, {loose: true}],
    [
      require('babel-plugin-transform-react-remove-prop-types').default,
      {
        wrap: true
      }
    ],
    [
      require('@babel/plugin-proposal-object-rest-spread').default,
      {useBuiltIns: true} // asume Object.assign is available by browser or polyfill
    ],
    [
      require('@babel/plugin-transform-runtime').default,
      {
        corejs: false,
        useESModules: true,
        regenerator: true
      }
    ],
    [
      require('@babel/plugin-transform-destructuring').default,
      {
        // Use loose mode for performance on selected react hooks
        loose: false,
        selectiveLoose: SELECTIVE_LOOSE_REACT_HOOKS
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
