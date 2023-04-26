const {
  DEFAULT_LEGACY_BROWSER_TARGETS,
  DEFAULT_BROWSER_TARGETS,
  DEFAULT_SERVER_TARGETS
} = require('./defaults.js')

const getTargets = ({targets = {}, isModern, isServer}) => {
  const {server, browser} = targets
  if (isServer) return server ?? DEFAULT_SERVER_TARGETS

  return (
    browser ??
    (isModern ? DEFAULT_BROWSER_TARGETS : DEFAULT_LEGACY_BROWSER_TARGETS)
  )
}

const plugins = (api, {useESModules = true} = {}) => [
  require('babel-plugin-preval'),
  require('@babel/plugin-syntax-export-default-from').default,
  require('@babel/plugin-syntax-export-namespace-from').default,
  [require('@babel/plugin-proposal-decorators').default, {legacy: true}],
  [require('@babel/plugin-proposal-class-properties').default, {loose: true}],
  require('babel-plugin-transform-react-remove-prop-types').default,
  [
    require('@babel/plugin-transform-runtime').default,
    {
      corejs: false,
      useESModules,
      regenerator: true
    }
  ]
]

const presets = (api, opts = {}) => {
  const {isModern, isServer, targets} = opts

  return [
    [
      require('@babel/preset-env').default,
      {
        debug: false,
        exclude: ['transform-typeof-symbol'], // Exclude transforms that make all code slower
        ignoreBrowserslistConfig: true,
        loose: true,
        modules: false,
        targets: getTargets({targets, isServer, isModern}),
        useBuiltIns: false
      }
    ],
    [
      require('@babel/preset-react').default,
      {runtime: 'automatic', useBuiltIns: true}
    ]
  ]
}

module.exports = (api, opts) => {
  // Permacache the computed config and never call this config function again
  // more info: https://babeljs.io/docs/en/config-files#config-function-api
  api.cache(true)

  return {
    presets: presets(api, opts),
    plugins: plugins(api, opts)
  }
}
