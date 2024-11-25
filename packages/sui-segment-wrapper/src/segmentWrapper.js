// @ts-check

import {getAdobeMCVisitorID} from './repositories/adobeRepository.js'
import {getGoogleClientID, getGoogleSessionID, setGoogleUserId} from './repositories/googleRepository.js'
import {getConfig} from './config.js'
import {checkAnalyticsGdprIsAccepted, getGdprPrivacyValue} from './tcf.js'
import {getXandrId} from './repositories/xandrRepository.js'

/* Default properties to be sent on all trackings */
const DEFAULT_PROPERTIES = {platform: 'web'}

/* Disabled integrations when no GDPR Privacy Value is true */
export const INTEGRATIONS_WHEN_NO_CONSENTS = {
  All: false
}

export const INTEGRATIONS_WHEN_NO_CONSENTS_CMP_SUBMITTED = {
  All: true
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
 * One of them is the AdobeMarketingCloudVisitorId for Adobe Analytics integration.
 * @param {object} param - Object with the gdprPrivacyValue and if it's a CMP Submitted event
 */
const getTrackIntegrations = async ({gdprPrivacyValue, event}) => {
  const isGdprAccepted = checkAnalyticsGdprIsAccepted(gdprPrivacyValue)
  let marketingCloudVisitorId
  let clientId
  let sessionId

  if (isGdprAccepted) {
    try {
      ;[marketingCloudVisitorId, clientId, sessionId] = await Promise.all([
        getAdobeMCVisitorID(),
        getGoogleClientID(),
        getGoogleSessionID()
      ])
    } catch (error) {
      console.error(error)
    }
  }

  const restOfIntegrations = getRestOfIntegrations({isGdprAccepted, event})

  // If we don't have the user consents we remove all the integrations but Adobe Analytics nor GA4
  return {
    ...restOfIntegrations,
    'Adobe Analytics': marketingCloudVisitorId ? {marketingCloudVisitorId} : true,
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
 * Get data like traits and integrations to be added to the context object
 * @param {object} context Context object with all the actual info
 * @returns {Promise<object>} New context with all the previous info and the new one
 */
export const decorateContextWithNeededData = async ({event = '', context = {}}) => {
  const gdprPrivacyValue = await getGdprPrivacyValue()
  const {analytics: gdprPrivacyValueAnalytics, advertising: gdprPrivacyValueAdvertising} = gdprPrivacyValue || {}
  const isGdprAccepted = checkAnalyticsGdprIsAccepted(gdprPrivacyValue)
  const [integrations, xandrId] = await Promise.all([
    getTrackIntegrations({gdprPrivacyValue, event}),
    getXandrId({gdprPrivacyValueAdvertising})
  ])

  if (!isGdprAccepted) {
    context.integrations = {
      ...(context.integrations ?? {}),
      Personas: false,
      Webhooks: true,
      Webhook: true
    }
  }

  return {
    ...context,
    ...(!isGdprAccepted && {ip: '0.0.0.0'}),
    ...getExternalIds({context, xandrId}),
    gdpr_privacy: gdprPrivacyValueAnalytics,
    gdpr_privacy_advertising: gdprPrivacyValueAdvertising,
    integrations: {
      ...context.integrations,
      ...integrations
    },
    clientVersion: `segment-wrapper@${process.env.VERSION ?? '0.0.0'}`
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
      const newContext = await decorateContextWithNeededData({context, event})

      /**
       * @deprecated Now we use `defaultContextProperties` middleware
       * and put the info on the context object
       */
      const newProperties = {
        ...getDefaultProperties(),
        ...properties
      }

      const newCallback = async (...args) => {
        if (callback) callback(...args) // eslint-disable-line n/no-callback-literal
        const [gdprPrivacyValue] = await Promise.all([getGdprPrivacyValue()])

        if (checkAnalyticsGdprIsAccepted(gdprPrivacyValue)) {
          resolve(...args)
        } else {
          resolve()
        }
      }

      window.analytics.track(
        event,
        newProperties,
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
 * @param {string} userId Id to identify the user.
 * @param {object} traits A dictionary of traits you know about the user, like their email or name.
 * @param {object} [options] A dictionary of options.
 * @param {function} [callback] A function executed after a short timeout, giving the browser time to make outbound requests first.
 * @returns {Promise}
 */
const identify = async (userId, traits, options, callback) => {
  const gdprPrivacyValue = await getGdprPrivacyValue()

  setGoogleUserId(userId)

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
