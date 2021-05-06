import {chromium} from 'playwright'
import cssPurge from 'css-purge'
import {blockedResourceTypes, skippedResources} from './config.js'

const {purgeCSS} = cssPurge

let browser

// Setup a browser instance or return the one already created
const getBrowser = async () => {
  if (browser) return browser

  browser = chromium.launch({
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage'
    ]
  })

  return browser
}

export async function extractCSSFromUrl({
  customHeaders,
  height,
  url,
  userAgent,
  width
}) {
  let page
  try {
    // Get a browser instance
    browser = await getBrowser()
    const context = await browser.newContext({userAgent})
    // Create a new page and navigate to it
    page = await context.newPage()
    // Set viewport and user agent depending on the device
    await page.setViewportSize({width, height})
    page.setDefaultNavigationTimeout(15000)

    const hasCustomHeaders =
      typeof customHeaders === 'object' && Object.keys(customHeaders).length
    hasCustomHeaders && (await page.setExtraHTTPHeaders(customHeaders))

    await page.route('**/*', route => {
      const request = route.request()
      return blockedResourceTypes.includes(request.resourceType()) ||
        skippedResources.includes(request.url())
        ? route.abort()
        : route.continue()
    })

    await page.coverage.startCSSCoverage()

    const response = await page
      .goto(url, {waitUntil: 'load'})
      .catch(error => ({error}))

    const closeAll = async error => {
      await page.close()
      await browser.close()
      browser = null
      if (error) throw new Error(`[ko] ${error}`)
    }

    if (!response) await closeAll('Response is not present')

    if (response.error)
      await closeAll(`Response has an error: ${response.error}`)

    if (!response.ok() && response.status() !== 304)
      await closeAll(`Response status code ${response.status()} for url ${url}`)

    console.log('[ok] Got response')

    const coverage = await page.coverage.stopCSSCoverage()
    console.log('[ok] Got coverage')

    let coveredCSS = ''
    for (const entry of coverage) {
      for (const range of entry.ranges) {
        coveredCSS += entry.text.slice(range.start, range.end)
      }
    }

    // Close the browser to close the connection and free up resources
    await closeAll()

    // return minified css
    return new Promise((resolve, reject) => {
      purgeCSS(coveredCSS, {}, (err, result) =>
        err ? reject(err) : resolve(result)
      )
    })
  } catch (e) {
    console.log(e)
    browser && browser.close && (await browser.close())
    browser = null
  }
}
