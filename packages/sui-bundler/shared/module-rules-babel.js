/* eslint-disable no-console */
const fs = require('fs-extra')
const path = require('path')
const {config} = require('./index.js')

const EXCLUDED_FOLDERS_REGEXP = new RegExp(
  `node_modules(?!${path.sep}@s-ui(${path.sep}studio)(${path.sep}workbench)?${path.sep}src)`
)

const getTSConfig = () => {
  // Get TS config from the package dir.
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json')
  let tsConfig

  try {
    if (fs.existsSync(tsConfigPath)) {
      tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, {encoding: 'utf8'}))
    }
  } catch (err) {
    console.error(err)
  }

  return tsConfig
}

module.exports = ({isServer = false, supportLegacyBrowsers = true} = {}) => {
  const tsConfig = getTSConfig()
  // If TS config exists in root dir, set TypeScript as enabled.
  const isTypeScriptEnabled = Boolean(tsConfig)

  return isTypeScriptEnabled
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
                    isModern: !supportLegacyBrowsers,
                    targets: config.targets
                  }
                ]
              ]
            }
          }
        ]
      }
}
