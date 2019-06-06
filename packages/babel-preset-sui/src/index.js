const cleanList = require('./clean-list')
const {
  DEFAULT_BROWSER_TARGETS,
  DEFAULT_SERVER_TARGETS,
  SELECTIVE_LOOSE_REACT_HOOKS
} = require('./defaults')

function getTargets({isServer, targets = {}}) {
  const {
    browser = DEFAULT_BROWSER_TARGETS,
    server = DEFAULT_SERVER_TARGETS
  } = targets

  if (isServer) return server
  return browser
}

function plugins(api, opts = {}) {
  return cleanList([
    require('@babel/plugin-syntax-dynamic-import').default,
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
      require('@babel/plugin-proposal-object-rest-spread').default,
      {useBuiltIns: true} // asume Object.assign is available by browser or polyfill
    ],
    [
      require('@babel/plugin-transform-runtime').default,
      {
        corejs: false,
        useESModules: true
      }
    ],
    [
      require('@babel/plugin-transform-destructuring').default,
      {
        // Use loose mode for performance
        loose: false,
        selectiveLoose: SELECTIVE_LOOSE_REACT_HOOKS
      }
    ]
  ])
}

function presets(api, opts) {
  const {isServer, targets} = opts

  return [
    [
      require('@babel/preset-env').default,
      {
        corejs: 3,
        debug: false,
        ignoreBrowserslistConfig: true,
        loose: true,
        modules: false,
        // Exclude transforms that make all code slower
        exclude: ['transform-typeof-symbol'],
        targets: getTargets({isServer, targets}),
        useBuiltIns: 'entry'
      }
    ],
    [require('@babel/preset-react').default, {useBuiltIns: true}]
  ]
}

module.exports = (api, opts) => ({
  presets: presets(api, opts),
  plugins: plugins(api, opts)
})
