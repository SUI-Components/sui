/* Extract sui-bundler from package.json -> "config": {"sui-bundler": { ... }} */
const path = require('path')
const {config: packageJsonConfig = {}} = require(`${process.cwd()}/package.json`)

const {'sui-bundler': config = {}} = packageJsonConfig
const {extractComments = false, sourcemaps, supportLegacyBrowsers = true} = config

exports.config = config
exports.supportLegacyBrowsers = supportLegacyBrowsers
exports.extractComments = extractComments
exports.sourceMap = (sourcemaps && sourcemaps.prod) || false
exports.cacheDirectory = path.resolve(process.cwd(), '.sui/cache')
