/* eslint-disable no-console */
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const {GenerateSW} = require('workbox-webpack-plugin')
const minifyJs = require('./shared/minify-js')
const webpack = require('webpack')
const definePlugin = require('./shared/define')
const babelRules = require('./shared/module-rules-babel')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader')

const crypto = require('crypto')
const zlib = require('zlib')
const hasBrotliSupport = Boolean(zlib.brotliCompress)

const {
  navigateFallbackDenylist,
  navigateFallback,
  runtimeCaching
} = require('./shared/precache')
const {when, cleanList, envVars, MAIN_ENTRY_POINT, config} = require('./shared')
const {sourceMap} = require('./shared/config')
const parseAlias = require('./shared/parse-alias')

const Externals = require('./plugins/externals')
const LoaderUniversalOptionsPlugin = require('./plugins/loader-options')

const PUBLIC_PATH = process.env.CDN || config.cdn || '/'

const FRAMEWORK_BUNDLES = [`react`, `react-dom`, `scheduler`, `prop-types`]
const isCssModule = module => module.type === `css/mini-extract`

module.exports = {
  devtool: sourceMap,
  mode: 'production',
  context: path.resolve(process.cwd(), 'src'),
  resolve: {
    alias: parseAlias(config.alias),
    extensions: ['*', '.js', '.jsx', '.json']
  },
  entry: config.vendor
    ? {
        app: MAIN_ENTRY_POINT,
        vendor: config.vendor
      }
    : MAIN_ENTRY_POINT,
  target: 'web',
  output: {
    path: path.resolve(process.env.PWD, 'public'),
    publicPath: PUBLIC_PATH,
    filename: config.onlyHash
      ? '[contenthash:8].js'
      : '[name].[contenthash:8].js',
    chunkFilename: config.onlyHash
      ? '[contenthash:8].js'
      : '[name].[contenthash:8].js'
  },
  optimization: {
    minimizer: [
      minifyJs(sourceMap),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {}
      })
    ],
    runtimeChunk: true,
    // https://github.com/wardpeet/gatsby/blob/241b52bbbdecc7fdd5500937e0b20dbfd5dbb799/packages/gatsby/src/utils/webpack.config.js#L489
    splitChunks: {
      chunks: `all`,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          chunks: `all`,
          name: `framework`,
          // This regex ignores nested copies of framework libraries so they're bundled with their issuer.
          test: new RegExp(
            `(?<!node_modules.*)[\\\\/]node_modules[\\\\/](${FRAMEWORK_BUNDLES.join(
              `|`
            )})[\\\\/]`
          ),
          priority: 40,
          // Don't let webpack eliminate this chunk (prevents this chunk from becoming a part of the commons chunk)
          enforce: true
        },
        // if a module is bigger than 160kb from node_modules we make a separate chunk for it
        lib: {
          test(module) {
            return (
              !isCssModule(module) &&
              module.size() > 160000 &&
              /node_modules[/\\]/.test(module.identifier())
            )
          },
          name(module) {
            const hash = crypto.createHash(`sha1`)
            if (!module.libIdent) {
              throw new Error(
                `Encountered unknown module type: ${module.type}. Please open an issue.`
              )
            }

            hash.update(module.libIdent({context: process.env.PWD}))

            return hash.digest(`hex`).substring(0, 8)
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true
        },
        commons: {
          name: `commons`,
          minChunks: 31, // TODO: Put number of PAGES !!!
          priority: 20
        },
        // If a chunk is used in at least 2 components we create a separate chunk
        shared: {
          test(module) {
            return !isCssModule(module)
          },
          name(module, chunks) {
            const hash = crypto
              .createHash(`sha1`)
              .update(chunks.reduce((acc, chunk) => acc + chunk.name, ``))
              .digest(`hex`)

            return hash
          },
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true
        },

        // Bundle all css & lazy css into one stylesheet to make sure lazy components do not break
        styles: {
          test(module) {
            return isCssModule(module)
          },

          name: `styles`,
          priority: 40,
          enforce: true
        }
      },
      maxInitialRequests: 25,
      minSize: 20000
    }
  },
  plugins: cleanList([
    new webpack.HashedModuleIdsPlugin(),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin(),
    new MiniCssExtractPlugin({
      filename: config.onlyHash
        ? '[contenthash:8].css'
        : '[name].[contenthash:8].css',
      chunkFilename: config.onlyHash
        ? '[contenthash:8].css'
        : '[id].[contenthash:8].css'
    }),
    new HtmlWebpackPlugin({
      env: process.env,
      inject: 'head',
      template: './index.html',
      trackJSToken: '',
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyURLs: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new ScriptExtHtmlWebpackPlugin(
      Object.assign(
        {
          defaultAttribute: 'defer',
          inline: 'runtime',
          prefetch: {
            test: /\.js$/,
            chunks: 'all'
          }
        },
        config.scripts
      )
    ),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
    when(
      config.offline,
      () =>
        new GenerateSW({
          skipWaiting: true,
          clientsClaim: true,
          dontCacheBustURLsMatching: /\.\w{8}\./,
          cleanupOutdatedCaches: true,
          directoryIndex: config.offline.directoryIndex,
          additionalManifestEntries: config.offline.addToCache,
          navigateFallback: navigateFallback(
            config.offline.fallback,
            PUBLIC_PATH
          ),
          navigateFallbackDenylist: navigateFallbackDenylist(
            config.offline.denylist
          ),
          runtimeCaching: runtimeCaching(config.offline.runtime),
          exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE\.txt$/]
        })
    ),
    when(config.externals, () => new Externals({files: config.externals})),
    new LoaderUniversalOptionsPlugin(require('./shared/loader-options')),
    when(
      config.manualCompression,
      () =>
        new CompressionPlugin({
          filename: '[path].gz',
          threshold: 0,
          minRatio: 2,
          test: /\.(js|css)$/i
        })
    ),
    when(
      config.manualCompression && hasBrotliSupport,
      () =>
        new CompressionPlugin({
          filename: '[path].br',
          algorithm: 'brotliCompress',
          threshold: 0,
          minRatio: 2,
          test: /\.(js|css)$/i,
          compressionOptions: {level: 11}
        })
    )
  ]),
  module: {
    rules: cleanList([
      babelRules,
      {
        test: /(\.css|\.scss)$/,
        use: cleanList([
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader'),
          when(config['externals-manifest'], () => ({
            loader: 'externals-manifest-loader',
            options: {
              manifestURL: config['externals-manifest']
            }
          })),
          require.resolve('postcss-loader'),
          require.resolve('sass-loader')
        ])
      },
      when(config['externals-manifest'], () =>
        manifestLoaderRules(config['externals-manifest'])
      )
    ])
  },
  resolveLoader: {
    alias: {
      'externals-manifest-loader': require.resolve(
        './loaders/ExternalsManifestLoader'
      )
    }
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
