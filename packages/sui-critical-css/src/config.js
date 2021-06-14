export const blockedResourceTypes = [
  'beacon',
  'csp_report',
  'font',
  'image',
  'imageset',
  'media',
  'object',
  'texttrack'
]

const GOOGLE_BOT_UA =
  '(compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
const CRITICAL_UA = `CriticalCSS`

export const devices = {
  m: {
    userAgent: `Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Mobile Safari/537.36 ${GOOGLE_BOT_UA} ${CRITICAL_UA}`,
    width: 360,
    height: 640
  },
  t: {
    userAgent: `Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1 ${GOOGLE_BOT_UA}`,
    width: 768,
    height: 1024
  },
  d: {
    userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36 ${GOOGLE_BOT_UA} ${CRITICAL_UA}`,
    width: 1024,
    height: 768
  }
}

export const skippedResources = [
  'adition',
  'adzerk',
  'analytics',
  'cdn.api.twitter',
  'clicksor',
  'clicktale',
  'doubleclick',
  'exelator',
  'facebook',
  'fontawesome',
  'google-analytics',
  'google',
  'googletagmanager',
  'mixpanel',
  'optimizely',
  'quantserve',
  'sharethrough',
  'tiqcdn',
  'zedo'
]
