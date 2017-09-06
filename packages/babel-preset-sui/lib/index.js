const isInstalled = require('./is-installed')
const cleanList = require('./clean-list')

module.exports = {
  'presets': cleanList([
    require('babel-preset-es2015'),
    isInstalled(['preact', 'react'], 'babel-preset-react'),
    isInstalled('flow-bin', 'babel-preset-flow')
  ]),
  'plugins': [
    require('babel-plugin-syntax-trailing-function-commas'),
    require('babel-plugin-transform-async-generator-functions'),
    require('babel-plugin-transform-async-to-generator'),
    require('babel-plugin-transform-decorators-legacy').default,
    require('babel-plugin-transform-class-properties'),
    require('babel-plugin-transform-object-rest-spread'),
    require('babel-plugin-transform-runtime'),
    require('babel-plugin-syntax-dynamic-import'),
    require('babel-plugin-transform-export-extensions'),
    [require('babel-plugin-transform-react-remove-prop-types').default, {
      mode: 'wrap'
    }]
  ],
  'env': {
    'development': {
      'plugins': cleanList([
        isInstalled(['preact', 'react'], 'react-hot-loader/babel')
      ])
    }
  }
}
