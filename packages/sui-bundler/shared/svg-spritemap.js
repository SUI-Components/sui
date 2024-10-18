const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
const {config} = require('./config.js')

const createSVGSpritemapPlugin = () => {
  const {spritemaps = []} = config

  return spritemaps.map(({path, options = {}}) => {
    return new SVGSpritemapPlugin(path, options)
  })
}

module.exports = createSVGSpritemapPlugin
