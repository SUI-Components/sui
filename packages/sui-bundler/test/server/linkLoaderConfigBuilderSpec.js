const {expect} = require('chai')

const linkLoaderConfigBuilder = require('../../loaders/linkLoaderConfigBuilder.js')

describe('linkLoaderConfigBuilder', () => {
  const packagesToLink = [__dirname]

  it('injects the sass link importer into rules that already use @s-ui/sass-loader', () => {
    const config = {
      module: {
        rules: [
          {
            test: /(\.css|\.scss)$/,
            exclude: /node_modules/,
            use: [
              'mini-css-extract-plugin-loader',
              'css-loader',
              'postcss-loader',
              require.resolve('@s-ui/sass-loader')
            ]
          }
        ]
      },
      resolve: {alias: {}}
    }

    const nextConfig = linkLoaderConfigBuilder({config, packagesToLink})
    const sassRule = nextConfig.module.rules[0]

    expect(sassRule.use).to.have.lengthOf(4)
    expect(sassRule.use[3]).to.be.an('object')
    expect(sassRule.use[3].loader).to.equal(require.resolve('@s-ui/sass-loader'))
    expect(sassRule.use[3].options.sassOptions).to.have.property('importer')
  })

  it('leaves the plainCssPackages passthrough rule untouched', () => {
    const config = {
      module: {
        rules: [
          {
            test: /(\.css|\.scss)$/,
            exclude: /node_modules[\\/](@adv-mt\/ui)[\\/]/,
            use: [
              'mini-css-extract-plugin-loader',
              'css-loader',
              'postcss-loader',
              require.resolve('@s-ui/sass-loader')
            ]
          },
          {
            test: /\.css$/,
            include: /node_modules[\\/](@adv-mt\/ui)[\\/]/,
            use: ['mini-css-extract-plugin-loader', 'css-loader']
          }
        ]
      },
      resolve: {alias: {}}
    }

    const nextConfig = linkLoaderConfigBuilder({config, packagesToLink})
    const plainCssRule = nextConfig.module.rules[1]

    // Before the fix, this rule's last loader (css-loader) was replaced with
    // @s-ui/sass-loader, breaking pre-built CSS (e.g. Tailwind v4 output)
    // from plainCssPackages when consumed via -l/-L linking.
    expect(plainCssRule.use).to.deep.equal(['mini-css-extract-plugin-loader', 'css-loader'])
  })

  it('returns the original config unmodified when there is nothing to link', () => {
    const config = {module: {rules: []}}
    const nextConfig = linkLoaderConfigBuilder({config, packagesToLink: [], linkAll: false})
    expect(nextConfig).to.equal(config)
  })
})
