import './utils/patchAnalytics.js'

import {campaignContext} from './middlewares/source/campaignContext.js'
import {pageData} from './middlewares/source/pageData.js'
import {defaultContextProperties} from './middlewares/source/defaultContextProperties.js'
import {pageReferrer} from './middlewares/source/pageReferrer.js'
import {userScreenInfo} from './middlewares/source/userScreenInfo.js'
import {userTraits} from './middlewares/source/userTraits.js'
import {
  getCampaignDetails,
  loadGoogleAnalytics,
  CONSENT_STATES,
  DEFAULT_DATA_LAYER_NAME
} from './repositories/googleRepository.js'
import {checkAnonymousId} from './utils/checkAnonymousId.js'
import {getConfig, isClient} from './config.js'
import analytics from './segmentWrapper.js'
import initTcfTracking from './tcf.js'
import {getUserDataAndNotify} from './universalId.js'

// Initialize TCF Tracking with Segment
initTcfTracking()

// Generate UniversalId if available
try {
  getUserDataAndNotify()
} catch (e) {
  console.error(`[segment-wrapper] UniversalID couldn't be initialized`) // eslint-disable-line
}

// Initialize middlewares
const addMiddlewares = () => {
  const experimentalPageDataMiddleware = getConfig('experimentalPageDataMiddleware')

  window.analytics.addSourceMiddleware(userTraits)
  window.analytics.addSourceMiddleware(defaultContextProperties)
  window.analytics.addSourceMiddleware(campaignContext)
  window.analytics.addSourceMiddleware(userScreenInfo)
  window.analytics.addSourceMiddleware(pageReferrer)

  if (experimentalPageDataMiddleware) {
    window.analytics.addSourceMiddleware(pageData)
  }
}

if (isClient && window.analytics) {
  // Initialize Google Analtyics if needed
  const googleAnalyticsMeasurementId = getConfig('googleAnalyticsMeasurementId')
  const dataLayerName = getConfig('googleAnalyticsDataLayer') || DEFAULT_DATA_LAYER_NAME

  if (googleAnalyticsMeasurementId) {
    const googleAnalyticsConfig = getConfig('googleAnalyticsConfig')

    window[dataLayerName] = window[dataLayerName] || []
    window.gtag =
      window.gtag ||
      function gtag() {
        window[dataLayerName].push(arguments)
      }

    window.gtag('js', new Date())
    window.gtag('consent', 'default', {
      analytics_storage: CONSENT_STATES.denied,
      ad_user_data: CONSENT_STATES.denied,
      ad_personalization: CONSENT_STATES.denied,
      ad_storage: CONSENT_STATES.denied
    })
    window.gtag('config', googleAnalyticsMeasurementId, {
      cookie_prefix: 'segment',
      send_page_view: false,
      ...googleAnalyticsConfig,
      ...getCampaignDetails()
    })
    loadGoogleAnalytics().catch(error => {
      console.error(error)
    })
  }

  window.analytics.ready(checkAnonymousId)
  window.analytics.addSourceMiddleware ? addMiddlewares() : window.analytics.ready(addMiddlewares)
}

export default analytics
export {getAdobeVisitorData, getAdobeMCVisitorID} from './repositories/adobeRepository.js'
export {getUniversalId} from './universalId.js'
export {EVENTS} from './events.js'
