/* Extract sui-bundler from package.json -> "config": {"sui-bundler": { ... }} */
const {config: packageJsonConfig = {}} = require(`${process.cwd()}/package.json`)

const {'sui-bundler': config = {}} = packageJsonConfig
const {extractComments = false, sourcemaps, supportLegacyBrowsers = true} = config

exports.config = config
exports.supportLegacyBrowsers = supportLegacyBrowsers
exports.extractComments = extractComments
exports.sourceMap = (sourcemaps && sourcemaps.prod) || false
