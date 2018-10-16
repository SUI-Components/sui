const isInstalled = require('./is-installed')
const cleanList = require('./clean-list')

module.exports = {
  presets: cleanList([
    [
      'env',
      {
        debug: false,
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
    isInstalled(['preact', 'react'], 'babel-preset-react')
  ]),
  plugins: [
    require('babel-plugin-transform-async-generator-functions'),
    require('babel-plugin-transform-decorators-legacy').default,
    require('babel-plugin-transform-class-properties'),
    require('babel-plugin-transform-object-rest-spread'),
    require('babel-plugin-transform-runtime'),
    require('babel-plugin-syntax-dynamic-import'),
    require('babel-plugin-transform-export-extensions'),
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
}
