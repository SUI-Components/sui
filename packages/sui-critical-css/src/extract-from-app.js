import {createHash} from 'crypto'
import {mkdir, writeFile} from 'fs/promises'
import {join} from 'path'
import {extractCSSFromUrl} from './extract-from-url.js'
import {devices} from './config.js'

const configForMobileDevice = devices.m

export const createUrlFrom = ({hostname, pathOptions}) => {
  const path = typeof pathOptions === 'string' ? pathOptions : pathOptions.url
  return `${hostname}${path}`
}

export async function extractCSSFromApp({routes, config = {}}) {
  const manifest = {}
  const {hostname, outputDir = '/critical-css'} = config
  const writeFilesPromises = []

  await mkdir(join(process.cwd(), outputDir), {recursive: true})

  for await (const [pathKey, pathOptions] of Object.entries(routes)) {
    const url = createUrlFrom({hostname, pathOptions})

    const hash = createHash('md5')
      .update(pathKey)
      .digest('hex')

    const cssFileName = `${hash}.css`

    manifest[pathKey] = cssFileName

    const css = await extractCSSFromUrl({
      url,
      ...configForMobileDevice
    }).catch(() => '')

    const cssPathFile = join(process.cwd(), outputDir, cssFileName)
    writeFilesPromises.push(writeFile(cssPathFile, css))
  }

  const results = await Promise.allSettled(writeFilesPromises)
  const errors = results.filter(r => r.status === 'rejected')

  if (errors.length) {
    console.warn('Some critical css files have not been written correctly:')
    errors.forEach(error => console.error(error))
  }
  console.log('All Critical CSS files written')

  const manifestPathFile = join(process.cwd(), outputDir, 'critical.json')
  await writeFile(manifestPathFile, JSON.stringify(manifest))
  console.log('Manifest Critical CSS created')
}
