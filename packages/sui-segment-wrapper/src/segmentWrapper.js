// @ts-check

import {
  CONSENT_STATES,
  getConsentState,
  getGoogleClientId,
  getGoogleConsentValue,
  getGoogleSessionId,
  sendGoogleConsents,
  setGoogleUserId
} from './repositories/googleRepository.js'
import {getXandrId} from './repositories/xandrRepository.js'
import {getConfig} from './config.js'
import {USER_GDPR, CMP_TRACK_EVENT, checkAnalyticsGdprIsAccepted, getGdprPrivacyValue} from './tcf.js'
import {isGA4DestinationEnabled} from './utils/ga4Detection.js'

/* Default properties to be sent on all trackings */
const DEFAULT_PROPERTIES = {platform: 'web'}

/* Disabled integrations when no GDPR Privacy Value is true */
export const INTEGRATIONS_WHEN_NO_CONSENTS = {
  All: false
}

export const INTEGRATIONS_WHEN_NO_CONSENTS_CMP_SUBMITTED = {
  All: true
}

const getUserId = userId => {
  const prefix = getConfig('userIdPrefix')

  if (!prefix) {
    return userId
  }

  if (typeof userId === 'number' || (typeof userId === 'string' && !userId.startsWith(prefix))) {
    return `${prefix}${userId}`
  }

  return userId
}

/**
 * Get default properties using the constant and the window.__mpi object if available
 * @returns {{[key:string]: any}} Default properties to attach to track
 */
export const getDefaultProperties = () => ({
  ...DEFAULT_PROPERTIES,
  ...getConfig('defaultProperties')
})

/**
 * Get all needed integrations depending on the gdprPrivacy value.
 * @param {object} param - Object with the gdprPrivacyValue and if it's a CMP Submitted event
 */
const getTrackIntegrations = async ({gdprPrivacyValue, event}) => {
  const isGdprAccepted = checkAnalyticsGdprIsAccepted(gdprPrivacyValue)
  const restOfIntegrations = getRestOfIntegrations({isGdprAccepted, event})

  // Check if we should use manual GA4 (legacy) or Segment destination (new)
  const useSegmentGA4Destination = isGA4DestinationEnabled()

  if (useSegmentGA4Destination) {
    // New behavior: let Segment handle GA4
    return {
      ...restOfIntegrations,
      'Google Analytics 4 Web': true
    }
  }

  // Legacy behavior: manual GA4 with clientId/sessionId
  let sessionId
  let clientId

  try {
    sessionId = await getGoogleSessionId()
    clientId = await getGoogleClientId()
  } catch (error) {
    console.error(
      '[segment-wrapper] Failed to retrieve GA4 session/client IDs. Events will be sent without session attribution.',
      error
    )
  }

  return {
    ...restOfIntegrations,
    'Google Analytics 4':
      clientId && sessionId
        ? {
            clientId,
            sessionId
          }
        : true
  }
}

/**
 * Get Rest of integrations depending on the gdprPrivacy value and if it's a CMP Submitted event
 * @param {object} param - Object with the isGdprAccepted and if it's a CMP Submitted event
 * @returns {object} integrations
 */
export const getRestOfIntegrations = ({isGdprAccepted, event}) => {
  const isCMPSubmittedEvent = event === 'CMP Submitted'

  if (isCMPSubmittedEvent) {
    return INTEGRATIONS_WHEN_NO_CONSENTS_CMP_SUBMITTED
  }
  return isGdprAccepted ? {} : INTEGRATIONS_WHEN_NO_CONSENTS
}

/**
 * It returns externalIds to add to context
 *
 * @param {Object} param
 * @param {Object} param.context previous context
 * @param {String} param.xandrId xandrId to be included
 * @returns
 */
const getExternalIds = ({context, xandrId}) => {
  const shouldSendXandrId = getConfig('sendXandrId') !== false
  const isValidXandrId = xandrId && parseInt(xandrId) !== 0
  if (!shouldSendXandrId || !isValidXandrId) {
    return {}
  }
  const SEGMENT_COLLECTION = 'users'
  const SEGMENT_ENCODING = 'none'
  const SEGMENT_TYPE = 'xandr_id'
  const externalIds = [
    ...(context?.externalIds || []),
    {
      collection: SEGMENT_COLLECTION,
      encoding: SEGMENT_ENCODING,
      id: xandrId,
      type: SEGMENT_TYPE
    }
  ]

  const uniqueExternalIds = externalIds.filter(
    ({id: idFilter, type: typeFilter}, index) =>
      index === externalIds.findIndex(({id: idFind, type: typeFind}) => idFilter === idFind && typeFilter === typeFind)
  )
  return {externalIds: uniqueExternalIds}
}

/**
 * Get consent value for Google Consent Mode
 * @param {string} gdprValue
 * @returns {string} consent value
 */
const getConsentValue = gdprValue => (gdprValue === USER_GDPR.ACCEPTED ? CONSENT_STATES.granted : CONSENT_STATES.denied)

/**
 * Get data like traits and integrations to be added to the context object
 * @param {object} context Context object with all the actual info
 * @returns {Promise<object>} New context with all the previous info and the new one
 */
export const decorateContextWithNeededData = async ({event = '', context = {}, properties = {}}) => {
  const gdprPrivacyValue = await getGdprPrivacyValue()
  const {analytics: gdprPrivacyValueAnalytics, advertising: gdprPrivacyValueAdvertising} = gdprPrivacyValue || {}
  const isGdprAccepted = checkAnalyticsGdprIsAccepted(gdprPrivacyValue)

  // Check if we should use Segment destination or legacy mode
  const useSegmentGA4Destination = isGA4DestinationEnabled()

  const [integrations, xandrId] = await Promise.all([
    getTrackIntegrations({gdprPrivacyValue, event}),
    getXandrId({gdprPrivacyValueAdvertising})
  ])

  // Build integrations without mutating context
  const contextIntegrations = !isGdprAccepted
    ? {
        ...(context.integrations ?? {}),
        Personas: false,
        Webhooks: true,
        Webhook: true
      }
    : context.integrations

  // Build Google Consent Mode object
  const googleConsents = {
    analytics_storage: useSegmentGA4Destination
      ? getConsentValue(gdprPrivacyValueAnalytics)
      : getGoogleConsentValue('analytics_storage') ?? getConsentValue(gdprPrivacyValueAnalytics),
    ad_storage: useSegmentGA4Destination
      ? getConsentValue(gdprPrivacyValueAdvertising)
      : getGoogleConsentValue('ad_storage') ?? getConsentValue(gdprPrivacyValueAdvertising),
    ad_user_data: useSegmentGA4Destination
      ? getConsentValue(gdprPrivacyValueAdvertising)
      : getGoogleConsentValue('ad_user_data') ?? getConsentValue(gdprPrivacyValueAdvertising),
    ad_personalization: useSegmentGA4Destination
      ? getConsentValue(gdprPrivacyValueAdvertising)
      : getGoogleConsentValue('ad_personalization') ?? getConsentValue(gdprPrivacyValueAdvertising)
  }

  const baseContext = {
    ...context,
    ...(!isGdprAccepted && {ip: '0.0.0.0'}),
    ...getExternalIds({context, xandrId}),
    clientVersion: `segment-wrapper@${process.env.VERSION ?? '0.0.0'}`,
    gdpr_privacy: gdprPrivacyValueAnalytics,
    gdpr_privacy_advertising: gdprPrivacyValueAdvertising,
    integrations: {
      ...contextIntegrations,
      ...integrations
    }
  }

  // Legacy behavior: add analytics_storage and google_consents to context
  if (!useSegmentGA4Destination) {
    baseContext.analytics_storage = getConsentState()
    baseContext.google_consents = googleConsents
  }

  return {
    context: baseContext,
    properties: useSegmentGA4Destination
      ? {
          ...properties,
          // New mode: add google_consents to properties
          google_consents: googleConsents
        }
      : properties
  }
}

/**
 * The track method lets you record any actions your users perform.
 * @param {string} event The name of the event you’re tracking
 * @param {object} [properties] A dictionary of properties for the event.
 * @param {object} [context] A dictionary of options.
 * @param {function} [callback] A function executed after a short timeout, giving the browser time to make outbound requests first.
 * @returns {Promise}
 */
const track = (event, properties, context = {}, callback) =>
  new Promise(resolve => {
    const initTrack = async () => {
      /**
       * @deprecated Now we use `defaultContextProperties` middleware
       * and put the info on the context object
       */
      const baseProperties = {
        ...getDefaultProperties(),
        ...properties
      }

      const {context: newContext, properties: decoratedProperties} = await decorateContextWithNeededData({
        context,
        event,
        properties: baseProperties
      })

      const newCallback = async (...args) => {
        if (callback) callback(...args) // eslint-disable-line n/no-callback-literal
        const [gdprPrivacyValue] = await Promise.all([getGdprPrivacyValue()])

        if (checkAnalyticsGdprIsAccepted(gdprPrivacyValue)) {
          resolve(...args)
        } else {
          resolve()
        }
      }

      const useSegmentGA4Destination = isGA4DestinationEnabled()
      const needsConsentManagement = getConfig('googleAnalyticsConsentManagement')

      // Legacy behavior: send consents to GTM
      if (!useSegmentGA4Destination && needsConsentManagement && event === CMP_TRACK_EVENT) {
        sendGoogleConsents('update', newContext.google_consents)
      }

      window.analytics.track(
        event,
        decoratedProperties,
        {
          ...newContext,
          context: {
            integrations: {
              ...newContext.integrations
            }
          }
        },
        newCallback
      )
    }

    initTrack()
  })

/**
 * Associate your users and their actions to a recognizable userId and traits.
 * @param {string} userIdParam Id to identify the user.
 * @param {object} traits A dictionary of traits you know about the user, like their email or name.
 * @param {object} [options] A dictionary of options.
 * @param {function} [callback] A function executed after a short timeout, giving the browser time to make outbound requests first.
 * @returns {Promise}
 */
const identify = async (userIdParam, traits, options, callback) => {
  const gdprPrivacyValue = await getGdprPrivacyValue()

  const userId = getUserId(userIdParam)

  // Legacy behavior: set user ID in gtag
  if (!isGA4DestinationEnabled()) {
    setGoogleUserId(userId)
  }

  return window.analytics.identify(
    userId,
    checkAnalyticsGdprIsAccepted(gdprPrivacyValue) ? traits : {},
    options,
    callback
  )
}

/**
 * Record whenever a user sees a page of your website, along with any optional properties about the page.
 * @param {string} event The name of the event you’re tracking
 * @param {object=} properties A dictionary of properties for the event.
 * @param {object} [context] A dictionary of options.
 * @param {function} [callback] A function executed after a short timeout, giving the browser time to make outbound requests first.
 * @returns {Promise}
 */
const page = (event, properties, context = {}, callback) => {
  // we put a flag on context to know this track is a page
  context.isPageTrack = true
  // just call track again but the with the proper context
  return track(event, properties, context, callback)
}

/**
 * Resets the id, including anonymousId, and clear traits for the currently identified user and group.
 * NOTE: Only clears the cookies and localStorage set by analytics.
 * @returns {Promise}
 */
const reset = () => Promise.resolve(window.analytics.reset())

export default {page, identify, track, reset}
