import {program} from 'commander'
import extractCSSFromUrl from './extract-css-from-url.js'
import {devices} from './config.js'

program
  .description('Extract Critical CSS from URL')
  .option('-a, --agent', 'Use specific user agent for viewport')
  .option('-d, --device', 'Use predefined device sizes')
  .option('-h, --height', 'Use specific height for viewport')
  .option('-u, --url <url>', 'URL to extract Critical CSS from')
  .option('-w, --width', 'Use specific width for viewport')
  .option(
    '-c, --customHeaders',
    'Define custom headers to be used when visiting url'
  )

program.parse()

const {
  agent: userAgent,
  customHeaders,
  device,
  height,
  url,
  width
} = program.opts()

// get the deviceInfo depending on the device path used, by default is mobile
const {
  width: widthFromDevice,
  height: heightFromDevice,
  userAgent: userAgentFromDevice
} = devices[device] || devices.m

let parsedCustomHeaders = {}
try {
  parsedCustomHeaders = JSON.parse(customHeaders)
} catch {}

;(async () => {
  const css = await extractCSSFromUrl({
    customHeaders: parsedCustomHeaders,
    height: height || heightFromDevice,
    url,
    userAgent: userAgent || userAgentFromDevice,
    width: width || widthFromDevice
  })
  console.log(css)
})()
