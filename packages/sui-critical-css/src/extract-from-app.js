import {createHash} from 'crypto'
import {mkdir, writeFile} from 'fs/promises'
import {join} from 'path'

import fetch from 'node-fetch'

import {devices} from './config.js'
import {extractCSSFromUrl} from './extract-from-url.js'

const TIME_BETWEEN_RETRIES = 1000
const TIMES_TO_RETRY = 15

const configForMobileDevice = devices.m

export const createUrlFrom = ({hostname, pathOptions}) => {
  const path = typeof pathOptions === 'string' ? pathOptions : pathOptions.url
  return Array.isArray(path)
    ? path.map(current => `${hostname}${current}`)
    : `${hostname}${path}`
}

const waitForHealthCheck = ({healthCheckUrl}) => {
  return new Promise(resolve => {
    async function retry(retries) {
      console.log(
        `Waiting for health check. Checking ${healthCheckUrl}, remaining ${retries} retries...`
      )
      if (retries === 0) return resolve(false)

      let isResponseOK = false
      try {
        const response = await fetch(healthCheckUrl)
        isResponseOK = response.ok
      } catch (e) {}

      return isResponseOK
        ? resolve(true)
        : globalThis.setTimeout(() => retry(--retries), TIME_BETWEEN_RETRIES)
    }

    retry(TIMES_TO_RETRY)
  })
}

const extractCriticalCSS = async ({
  requiredClassNames,
  retries = 3,
  url,
  configForMobileDevice
} = {}) => {
  if (retries === 0) {
    console.log(
      `Attempt limit reached. requiredClassNames has not been found in ${url}`
    )
    return ''
  }

  const css = await extractCSSFromUrl({
    url,
    ...configForMobileDevice
  }).catch(() => {
    console.error(`Error extracting Critical CSS from ${url}`)
    return ''
  })

  if (!requiredClassNames) return css

  const hasRequiredClasses = requiredClassNames.every(className =>
    css?.includes(className)
  )

  if (!hasRequiredClasses) {
    const nextTryNumber = retries - 1

    console.log(
      `requiredClassNames has not been found. Retries remaining: ${nextTryNumber}`
    )

    return extractCriticalCSS({
      requiredClassNames,
      retries: nextTryNumber,
      url,
      configForMobileDevice
    })
  }
  return css
}

export async function extractCSSFromApp({routes, config = {}}) {
  const manifest = {}
  const {healthCheckPath, hostname, outputDir = '/critical-css'} = config
  const writeFilesPromises = []

  if (healthCheckPath) {
    const healthCheckUrl = createUrlFrom({
      hostname,
      pathOptions: healthCheckPath
    })

    const isHealthCheckEnabled = await waitForHealthCheck({healthCheckUrl})

    if (!isHealthCheckEnabled) {
      console.error(`Error reaching healthCheck ${healthCheckUrl}`)
      process.exit(1)
    }
  }

  await mkdir(join(process.cwd(), outputDir), {recursive: true})

  for await (const [pathKey, pathOptions] of Object.entries(routes)) {
    const url = createUrlFrom({hostname, pathOptions})

    const hash = createHash('md5').update(pathKey).digest('hex')

    const cssFileName = `${hash}.css`

    manifest[pathKey] = cssFileName

    const {requiredClassNames, retries} = pathOptions
    const css = await extractCriticalCSS({
      requiredClassNames,
      retries,
      url,
      configForMobileDevice
    })

    const cssPathFile = join(process.cwd(), outputDir, cssFileName)
    writeFilesPromises.push(writeFile(cssPathFile, css))

    console.log(`Critical CSS for ${url} extracted`)
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
