import path from 'path'
import fs from 'fs'

let ssrConf
try {
  const spaConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  )
  const {config = {}} = spaConfig
  ssrConf = config['sui-ssr'] || {}
} catch (e) {
  ssrConf = {}
}

export default ssrConf
