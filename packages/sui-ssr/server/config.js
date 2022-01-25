import path from 'path'
import fs from 'fs'

const DEFAULT_VALUES = {
  useLegacyContext: true
}

const ASYNC_CSS_ATTRS =
  'rel="stylesheet" media="print" as="style" onload="this.media=\'all\'"'

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

export default {
  ASYNC_CSS_ATTRS,
  ...DEFAULT_VALUES,
  ...ssrConfig
}
