/* Extract sui-bundler from package.json -> "config": {"sui-bundler": { ... }} */
const {
  config: packageJsonConfig = {}
} = require(`${process.cwd()}/package.json`)
const {'sui-bundler': config = {}} = packageJsonConfig

const {extractComments, sourcemaps} = config

exports.config = config
exports.useExperimentalMinifier =
  config.optimizations && config.optimizations.useExperimentalMinifier
exports.extractComments = extractComments || false
exports.sourceMap = (sourcemaps && sourcemaps.prod) || false
