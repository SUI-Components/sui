const cleanList = require('./clean-list')

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
        regenerator: true
      }
    ]
  ])
}

function presets(api, opts) {
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
        targets: {
          node: '6.0.0',
          browsers: [
            '> 0.25%',
            'Firefox ESR',
            'Safari >= 8',
            'iOS >= 8',
            'ie >= 11',
            'not op_mini all',
            'not dead'
          ]
        },
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
