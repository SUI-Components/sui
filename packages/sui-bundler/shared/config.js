/* Extract sui-bundler from package.json -> "config": {"sui-bundler": { ... }} */
import {createRequire} from 'module'
import path from 'path'

const require = createRequire(import.meta.url)
const {config: packageJsonConfig = {}} = require(`${process.cwd()}/package.json`)

export const {'sui-bundler': config = {}} = packageJsonConfig
export const {extractComments = false, supportLegacyBrowsers = true} = config

export const sourceMap = (config.sourcemaps && config.sourcemaps.prod) || false
export const cacheDirectory = path.resolve(process.cwd(), '.sui/cache')
