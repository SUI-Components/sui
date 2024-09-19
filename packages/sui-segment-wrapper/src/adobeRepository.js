import {getConfig} from './config.js'

let mcvid

const getGlobalConfig = () => {
  return {
    ADOBE_ORG_ID: window.__SEGMENT_WRAPPER?.ADOBE_ORG_ID,
    DEFAULT_DEMDEX_VERSION: window.__SEGMENT_WRAPPER?.DEFAULT_DEMDEX_VERSION ?? '3.3.0',
    TIME_BETWEEN_RETRIES: window.__SEGMENT_WRAPPER?.TIME_BETWEEN_RETRIES ?? 15,
    TIMES_TO_RETRY: window.__SEGMENT_WRAPPER?.TIMES_TO_RETRY ?? 80,
    SERVERS: {
      trackingServer: window.__SEGMENT_WRAPPER?.TRACKING_SERVER,
      trackingServerSecure: window.__SEGMENT_WRAPPER?.TRACKING_SERVER
    }
  }
}

const getDemdex = () => {
  const config = getGlobalConfig()

  return window.Visitor && window.Visitor.getInstance(config.ADOBE_ORG_ID, config.SERVERS)
}

const getMarketingCloudVisitorID = demdex => {
  const mcvid = demdex && demdex.getMarketingCloudVisitorID()
  return mcvid
}

const getAdobeVisitorData = () => {
  const demdex = getDemdex() || {}
  const config = getGlobalConfig()
  const {version = config.DEFAULT_DEMDEX_VERSION} = demdex
  const {trackingServer} = config.SERVERS

  return Promise.resolve({trackingServer, version})
}

export const getAdobeMarketingCloudVisitorIdFromWindow = () => {
  if (mcvid) return Promise.resolve(mcvid)

  const config = getGlobalConfig()

  return new Promise(resolve => {
    function retry(retries) {
      if (retries === 0) return resolve('')

      const demdex = getDemdex()
      mcvid = getMarketingCloudVisitorID(demdex)
      return mcvid ? resolve(mcvid) : window.setTimeout(() => retry(--retries), config.TIME_BETWEEN_RETRIES)
    }
    retry(config.TIMES_TO_RETRY)
  })
}

const importVisitorApiAndGetAdobeMCVisitorID = () =>
  import('./adobeVisitorApi.js').then(() => {
    mcvid = getAdobeMarketingCloudVisitorIdFromWindow()
    return mcvid
  })

const getAdobeMCVisitorID = () => {
  const getCustomAdobeVisitorId = getConfig('getCustomAdobeVisitorId')
  if (typeof getCustomAdobeVisitorId === 'function') {
    return getCustomAdobeVisitorId()
  }

  return getConfig('importAdobeVisitorId') === true
    ? importVisitorApiAndGetAdobeMCVisitorID()
    : getAdobeMarketingCloudVisitorIdFromWindow()
}

export {getAdobeVisitorData, getAdobeMCVisitorID}
