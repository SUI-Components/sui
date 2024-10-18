const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
const {config} = require('./config.js')

const createSVGSpritemapPlugin = () => {
  const {spritemaps = []} = config

  return spritemaps.map(({path, name}) => {
    return new SVGSpritemapPlugin([path], {
      output: {
        filename: `${name}.[contenthash].svg`,
        chunk: {
          name
        }
      },
      sprite: {
        generate: {
          title: false
        }
      }
    })
  })
}

module.exports = createSVGSpritemapPlugin
