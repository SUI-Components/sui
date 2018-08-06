const path = require('path')

module.exports = ({config, packagesToLink}) => {
  if (packagesToLink.length === 0) {
    return config
  }

  const entryPoints = packagesToLink.reduce((acc, packagePath) => {
    const pkg = require(path.join(packagePath, 'package.json'))
    acc[pkg.name] = path.join(packagePath, 'src')
    return acc
  }, {})

  const nextConfig = {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /(\.css|\.scss)$/,
          use: {
            loader: 'link-loader',
            options: {
              entryPoints
            }
          }
        },
        {
          test: /\.jsx?$/,
          // TODO: That is crap, I need better options
          exclude: new RegExp(
            `node_modules(?!${path.sep}@s-ui${path.sep}studio(${
              path.sep
            }workbench)?${path.sep}src)`
          ),
          use: {
            loader: 'link-loader',
            options: {
              entryPoints
            }
          }
        }
      ]
    },
    resolveLoader: {
      alias: {
        'link-loader': require.resolve('./LinkLoader')
      }
    }
  }
  return nextConfig
}
