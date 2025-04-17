import CleanCSS from 'clean-css'
import {chromium} from 'playwright-chromium'

import {blockedResourceTypes, skippedResources} from './config.js'

let browser

const css = new CleanCSS({level: 2})

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

export async function extractCSSFromUrl({customHeaders, height, url, userAgent, width}) {
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

    const hasCustomHeaders = typeof customHeaders === 'object' && Object.keys(customHeaders).length
    hasCustomHeaders && (await page.setExtraHTTPHeaders(customHeaders))

    await page.route('**/*', route => {
      const request = route.request()
      return blockedResourceTypes.includes(request.resourceType()) || skippedResources.includes(request.url())
        ? route.abort().catch(() => {})
        : route.continue().catch(() => {})
    })

    await page.coverage.startCSSCoverage()

    const urls = Array.isArray(url) ? url : [url]
    const responses = []

    for (url of urls) {
      const response = await page.goto(url, {waitUntil: 'networkidle', timeout: 10000}).catch(error => ({error}))

      responses.push(response)
    }

    const closeAll = async error => {
      await page.close()
      await browser.close()
      browser = null
      if (error) throw new Error(`[ko] ${JSON.stringify(error)}`)
    }

    if (!responses.length) await closeAll('Response is not present')

    const error = responses.find(response => response.error)

    if (error) await closeAll(error)

    const current = responses.find(response => !response.ok() && response.status() !== 304)

    if (current) await closeAll(`Response status code ${current.status()} for url ${current.url()}`)

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
    const {styles, stats} = css.minify(coveredCSS)
    console.log(`[css] Minified from ${stats.originalSize} to ${stats.minifiedSize} bytes`)
    return styles
  } catch (e) {
    console.log(e)
    browser && browser.close && (await browser.close())
    browser = null
  }
}
