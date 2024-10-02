import './utils/patchAnalytics.js'

import {defaultContextProperties} from './middlewares/source/defaultContextProperties.js'
import {pageReferrer} from './middlewares/source/pageReferrer.js'
import {userScreenInfo} from './middlewares/source/userScreenInfo.js'
import {userTraits} from './middlewares/source/userTraits.js'
import {checkAnonymousId} from './utils/checkAnonymousId.js'
import {isClient} from './config.js'
import analytics from './segmentWrapper.js'
import initTcfTracking from './tcf.js'
import {getUserDataAndNotify} from './universalId.js'

/* Initialize TCF Tracking with Segment */
initTcfTracking()

/* Generate UniversalId if available */
try {
  getUserDataAndNotify()
} catch (e) {
  console.error(`[segment-wrapper] UniversalID couldn't be initialized`) // eslint-disable-line
}

/* Initialize middlewares */
const addMiddlewares = () => {
  window.analytics.addSourceMiddleware(userTraits)
  window.analytics.addSourceMiddleware(defaultContextProperties)
  window.analytics.addSourceMiddleware(userScreenInfo)
  window.analytics.addSourceMiddleware(pageReferrer)
}

/* Initialize Segment on Client */
if (isClient && window.analytics) {
  window.analytics.ready(checkAnonymousId)
  window.analytics.addSourceMiddleware ? addMiddlewares() : window.analytics.ready(addMiddlewares)
}

export default analytics
export {getAdobeVisitorData, getAdobeMCVisitorID} from './repositories/adobeRepository.js'
export {getUniversalId} from './universalId.js'
