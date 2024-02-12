/* eslint-disable no-console */
import {createRequire} from 'module'
import path from 'path'

import fs from 'fs-extra'

import {getSWCConfig} from '@s-ui/compiler-config'

const require = createRequire(import.meta.url)

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

export default ({isServer = false, isDevelopment = false, supportLegacyBrowsers = true} = {}) => {
  const tsConfig = getTSConfig()
  // If TS config exists in root dir, set TypeScript as enabled.
  const isTypeScriptEnabled = Boolean(tsConfig)

  return {
    test: /\.(js|ts)x?$/,
    exclude: EXCLUDED_FOLDERS_REGEXP,
    use: [
      {
        loader: require.resolve('swc-loader'),
        options: getSWCConfig({isTypeScript: isTypeScriptEnabled})
      }
    ]
  }
}
