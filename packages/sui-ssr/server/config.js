import path from 'path'
import fs from 'fs'

const DEFAULT_VALUES = {
  serverContentType: 'html',
  useLegacyContext: true
}

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

export default {...DEFAULT_VALUES, ...ssrConfig}
