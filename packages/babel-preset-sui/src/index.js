const cleanList = require('./clean-list')
const {
  DEFAULT_LEGACY_TARGETS,
  DEFAULT_MODERN_TARGETS,
  DEFAULT_SERVER_TARGETS,
  SELECTIVE_LOOSE_REACT_HOOKS
} = require('./defaults')

function getTargets({isModern, isServer, targets}) {
  const {
    legacy = DEFAULT_LEGACY_TARGETS,
    modern = DEFAULT_MODERN_TARGETS,
    server = DEFAULT_SERVER_TARGETS
  } = targets

  if (isServer) return server
  if (isModern) return modern
  return legacy
}

function plugins(api, opts = {}) {
  const {isModern} = opts
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
    !isModern && [
      require('@babel/plugin-proposal-object-rest-spread').default,
      {useBuiltIns: true} // asume Object.assign is available by browser or polyfill
    ],
    [
      require('@babel/plugin-transform-runtime').default,
      {
        corejs: false,
        useESModules: isModern
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
  const {isModern, isServer, targets} = opts

  return [
    [
      require('@babel/preset-env').default,
      {
        corejs: 3,
        debug: true, // remove true here
        ignoreBrowserslistConfig: true,
        loose: true,
        modules: false,
        // Exclude transforms that make all code slower
        exclude: ['transform-typeof-symbol'],
        targets: getTargets({isModern, isServer, targets}),
        useBuiltIns: 'entry'
      }
    ],
    [require('@babel/preset-react').default, {useBuiltIns: true}]
  ]
}

module.exports = (api, opts) =>
  console.log('*******************', opts) || {
    presets: presets(api, opts),
    plugins: plugins(api, opts)
  }
