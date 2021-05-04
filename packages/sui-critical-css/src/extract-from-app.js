import {createHash} from 'crypto'
import {mkdir, writeFile} from 'fs/promises'
import {join} from 'path'
import {extractCSSFromUrl} from './extract-from-url.js'
import {devices} from './config.js'

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

    const configForMobileDevice = devices.m

    const css = await extractCSSFromUrl({
      url,
      ...configForMobileDevice
    })

    const cssPathFile = join(process.cwd(), outputDir, cssFileName)
    writeFile(cssPathFile, css)
  }

  const manifestPathFile = join(process.cwd(), outputDir, 'critical.json')
  await writeFile(manifestPathFile, JSON.stringify(manifest))

  const results = await Promise.allSettled(writeFilesPromises)
  const errors = results.filter(r => r.status === 'rejected')

  if (errors.length) console.warn('Some files have not been written correctly')
  console.log('All files written')
}
