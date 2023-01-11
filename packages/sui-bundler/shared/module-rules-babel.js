const path = require('path')
const {config} = require('./index.js')

const isTypeScript = config?.parser?.syntax === 'typescript'

const EXCLUDED_FOLDERS_REGEXP = new RegExp(
  `node_modules(?!${path.sep}@s-ui(${path.sep}studio)(${path.sep}workbench)?${path.sep}src)`
)

module.exports = ({isServer = false} = {}) =>
  isTypeScript
    ? {
        test: /\.(js|ts)x?$/,
        exclude: EXCLUDED_FOLDERS_REGEXP,
        use: [
          {
            loader: require.resolve('swc-loader'),
            options: {
              minify: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  dynamicImport: true,
                  privateMethod: true,
                  functionBind: true,
                  exportDefaultFrom: true,
                  exportNamespaceFrom: true,
                  decorators: true,
                  decoratorsBeforeExport: true,
                  topLevelAwait: true,
                  importMeta: true
                },
                transform: {
                  legacyDecorator: true,
                  react: {
                    useBuiltins: true,
                    runtime: 'automatic'
                  }
                },
                target: 'es5',
                loose: true,
                externalHelpers: true
              },
              env: {
                targets: {
                  ie: '11'
                },
                dynamicImport: true,
                loose: true,
                mode: 'entry',
                coreJs: 3
              }
            }
          }
        ]
      }
    : {
        test: /\.jsx?$/,
        exclude: EXCLUDED_FOLDERS_REGEXP,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              babelrc: false,
              compact: true,
              presets: [
                [
                  require.resolve('babel-preset-sui'),
                  {
                    isServer,
                    supportLegacyBrowsers: true,
                    targets: config.targets
                  }
                ]
              ]
            }
          }
        ]
      }
