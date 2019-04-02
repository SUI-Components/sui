const cleanList = require('./clean-list')

function plugins(api, opts = {}) {
  const {es6} = opts
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
    !es6 && [
      require('@babel/plugin-proposal-object-rest-spread').default,
      {useBuiltIns: true} // asume Object.assign is available by browser or polyfill
    ],
    !es6 && require('@babel/plugin-transform-runtime').default
  ])
}

function presets(api, opts) {
  const {es6} = opts
  const es5Target = {
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
  }
  const es6Target = {
    esmodules: true
  }
  return [
    [
      require('@babel/preset-env').default,
      {
        debug: true,
        ignoreBrowserslistConfig: true,
        loose: true,
        modules: false,
        // Exclude transforms that make all code slower
        exclude: ['transform-typeof-symbol'],
        targets: es6 ? es6Target : es5Target,
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
