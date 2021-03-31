import path from 'path'
import fs from 'fs'

const DEFAULT_VALUES = {
  serverContentType: 'html',
  useLegacyContext: true
}

const ASYNC_CSS_ATTRS =
  'rel="stylesheet" media="only x" as="style" onload="this.media=\'all\';var e=document.getElementById(\'critical\');e.parentNode.removeChild(e);"'

let ssrConfig
try {
  const spaConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  )
  const {config = {}} = spaConfig
  ssrConfig = config['sui-ssr'] || {}
} catch (e) {
  ssrConfig = {}
}

let assetsManifest
try {
  assetsManifest = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), '/public/asset-manifest.json'),
      'utf8'
    )
  )
} catch (error) {
  assetsManifest = null
}

export default {
  ASYNC_CSS_ATTRS,
  ...DEFAULT_VALUES,
  ...ssrConfig,
  assetsManifest
}
