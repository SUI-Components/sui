const isInstalled = require('./is-installed')
const cleanList = require('./clean-list')

module.exports = () => ({
  presets: cleanList([
    [
      '@babel/preset-env',
      {
        debug: false,
        loose: true,
        targets: {
          node: '6.0.0',
          browsers: [
            '> 0.25%',
            'Firefox ESR',
            'Safari >= 8',
            'iOS >= 8',
            'ie >= 11',
            'not op_mini all'
          ]
        }
      }
    ],
    isInstalled(['preact', 'react'], '@babel/preset-react')
  ]),
  plugins: [
    require('@babel/plugin-proposal-async-generator-functions'),
    [require('@babel/plugin-proposal-decorators'), {legacy: true}],
    [require('@babel/plugin-proposal-class-properties'), {loose: true}],
    [
      require('@babel/plugin-proposal-object-rest-spread'),
      {loose: true, useBuiltIns: true}
    ],
    require('@babel/plugin-transform-runtime'),
    require('@babel/plugin-syntax-dynamic-import'),
    require('@babel/plugin-proposal-export-default-from'),
    require('@babel/plugin-proposal-export-namespace-from'),
    [
      require('babel-plugin-transform-react-remove-prop-types').default,
      {
        mode: 'wrap'
      }
    ]
  ],
  env: {
    development: {
      plugins: cleanList([
        isInstalled(['preact', 'react'], 'react-hot-loader/babel')
      ])
    }
  }
})
