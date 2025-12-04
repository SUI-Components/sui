import {getConfig, isClient, setConfig} from './config.js'
import analytics from './segmentWrapper.js'

/**
 * Cookie to extract the already saved consents for the user
 * @type {string}
 */
const TCF_COOKIE_KEY = 'borosTcf'
/**
 * TCF Api Version to use
 * @type {number}
 */
const TCF_API_VERSION = 2

/**
 * Default properties to send with every TCF tracking event
 */
const TCF_TRACK_PROPERTIES = {
  channel: 'GDPR'
}

/**
 * List of purpose ids needed to be able to track with all info
 * @type {Array<number>}
 */
const NEEDED_PURPOSES = {
  analytics: [1, 8, 10],
  advertising: [3]
}

/**
 * TCF events
 */
const TCF_EVENTS = {
  // Event that determines that the tcData has been loaded
  LOADED: 'tcloaded',
  // Event that determines that the user has performed an action
  USER_ACTION_COMPLETE: 'useractioncomplete'
}

export const CMP_TRACK_EVENT = 'CMP Submitted'

/**
 * State of user according to GDPR regarding tracking
 */
export const USER_GDPR = {
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  UNKNOWN: 'unknown'
}

/**
 * Define the user GDPR consents state. This value will be updated with new values
 * when the consents of the users changes.
 */
const gdprState = {
  listeners: [],
  value: undefined,
  addListener: callback => gdprState.listeners.push(callback),
  get: () => gdprState.value,
  set: value => {
    const {analytics, advertising} = value || {}
    gdprState.value = {
      analytics,
      advertising
    }
    gdprState.listeners.forEach(fn => fn(value))
    gdprState.listeners = []
  }
}

/**
 * Read cookie by using a key
 * @returns {string}
 */
function readCookie(key) {
  const re = new RegExp(key + '=([^;]+)')
  const value = re.exec(document.cookie)
  return value !== null ? unescape(value[1]) : null
}

/**
 * Check if we're on client and tcfApi is available on window object
 * @returns {Boolean}
 */
const checkTcfIsAvailable = () => {
  // if we're on the client, check we haven't already initialized it
  if (getConfig('initialized')) return false

  // if we're on client, check if we have the tcfapi available
  const isTcfApiAvailable = !!window.__tcfapi
  !isTcfApiAvailable &&
    console.warn("[tcfTracking] window.__tcfapi is not available on client and TCF won't be tracked.")
  return isTcfApiAvailable
}

/**
 * Check from a list of consents if user has accepted being tracked
 * @param {{[purposeId: string]: boolean}} userConsents
 * @returns {Boolean}
 */
const checkHasUserConsentedAnalytics = userConsents =>
  NEEDED_PURPOSES.analytics.every(purposeId => userConsents[`${purposeId}`])

const checkHasUserConsentedAdvertising = userConsents =>
  NEEDED_PURPOSES.advertising.every(purposeId => userConsents[`${purposeId}`])

/**
 * Track a specific TCF event
 * @param {object} params
 * @param {string} params.eventId Event ID to be sent with the TCF Tracking
 * @param {string} params.gdprPrivacy Send a string telling if the gdpr has been accepted or reject
 * @return {Promise}
 */
const trackTcf = ({eventId, gdprPrivacy}) =>
  analytics.track(
    CMP_TRACK_EVENT,
    {
      ...TCF_TRACK_PROPERTIES,
      ...getConfig('tcfTrackDefaultProperties')
    },
    {
      gdpr_privacy: gdprPrivacy.analytics,
      gdpr_privacy_advertising: gdprPrivacy.advertising
    }
  )

/**
 * Get if we have user consents
 * @return {Promise<Object>}
 */
export const getGdprPrivacyValue = () => {
  // try to get the actual gdprPrivacyValue and just return it
  const gdprPrivacyValue = gdprState.get()
  if (gdprPrivacyValue !== undefined) return Promise.resolve(gdprPrivacyValue)

  // // if we don't have a gdprPrivacyValue, then subscribe to it until we have a value
  return new Promise(resolve => {
    gdprState.addListener(gdprPrivacyValue => resolve(gdprPrivacyValue))
  })
}

/**
 * Check if gdprPrivacyValue is accepted
 * @return {boolean}
 */
export const checkAnalyticsGdprIsAccepted = gdprPrivacyValue => {
  return gdprPrivacyValue.analytics === USER_GDPR.ACCEPTED
}

/**
 * Set gdprState according to list of purpose consents
 * @returns {string}
 */
const setGdprStateBy = purposeConsents => {
  const hasAnalyticsConsents = checkHasUserConsentedAnalytics(purposeConsents)
  const hasAdvertisingConsents = checkHasUserConsentedAdvertising(purposeConsents)
  // get the state key according to the gdprPrivacyValue
  const gdprAnalyticsStateKey = hasAnalyticsConsents ? USER_GDPR.ACCEPTED : USER_GDPR.DECLINED

  const gdprAdvertisingStateKey = hasAdvertisingConsents ? USER_GDPR.ACCEPTED : USER_GDPR.DECLINED
  // update gdprState with the new value for user gdpr
  gdprState.set({
    analytics: gdprAnalyticsStateKey,
    advertising: gdprAdvertisingStateKey
  })
  // return the new gdprState
  return {
    analytics: gdprAnalyticsStateKey,
    advertising: gdprAdvertisingStateKey
  }
}

/**
 * Read and decode the tcf cookie
 */
const getConsentsFromCookie = () => {
  const cookieValue = readCookie(TCF_COOKIE_KEY)
  if (!cookieValue) return

  try {
    const {purpose} = JSON.parse(window.atob(cookieValue))
    const {consents} = purpose
    return consents
  } catch (e) {
    console.error(e)
  }
}

/**
 * Set the correct initial gdprState based on the consents cookie string
 */
const initializeGdprState = () => {
  const consents = getConsentsFromCookie()
  if (consents) setGdprStateBy(consents)
}

/**
 * Sets global isFirstVisit flag based on the consents cookie string
 */
const initializeIsFirstVisit = () => {
  const consents = getConsentsFromCookie()
  setConfig('isFirstVisit', !consents)
}

/**
 * Init TCF Tracking User Consents with Segment
 */
export default function initTcfTracking() {
  // first check if we're on server, as this doesn't work on server-side
  if (!isClient) return
  // read the cookie and put the correct usergdprValue and isFirstVisit flag before listening events
  initializeGdprState()
  initializeIsFirstVisit()
  // do some checks before initializing tcf tracking as we do that only if available
  if (!checkTcfIsAvailable()) {
    // if we don't have a gdpr state and tcf is not available
    // we should assume we don't known if we have consents
    const analyticsGdprState = gdprState.get()?.analytics
    if (analyticsGdprState === undefined)
      gdprState.set({
        analytics: USER_GDPR.UNKNOWN,
        advertising: USER_GDPR.UNKNOWN
      })
    // and we stop executing as we can't track tcf
    return
  }
  // add a flag to the segmentWrapper config to know it's already initialized
  setConfig('initialized', true)

  // listen events from tcf api
  window.__tcfapi('addEventListener', TCF_API_VERSION, ({eventStatus, purpose}, success) => {
    if (!success) return Promise.resolve()

    // if we've already user consents or the user is accepting or declining now
    // we change the state of the GDPR to use in our tracking
    if (eventStatus === TCF_EVENTS.USER_ACTION_COMPLETE || eventStatus === TCF_EVENTS.LOADED) {
      const {consents} = purpose
      const gdprStateKey = setGdprStateBy(consents)
      // if it's a user action, then we will track it
      if (eventStatus === TCF_EVENTS.USER_ACTION_COMPLETE) {
        // extract the eventId and gdprPrivacy string to send with the track
        const {analytics: analyticsStateKey, advertising: advertisingStateKey} = gdprStateKey

        const gdprPrivacy = {
          analytics: analyticsStateKey,
          advertising: advertisingStateKey
        }

        // temporary during Didomi migration to avoid fake programmatically generated events where the users doesn't really interact
        const MIGRATION_DIDOMI_SEGMENT_WRAPPER_FLAG = 'didomi-migration'
        const isDidomiMigration = isClient && window.sessionStorage.getItem(MIGRATION_DIDOMI_SEGMENT_WRAPPER_FLAG)
        return (
          !isDidomiMigration &&
          trackTcf({
            gdprPrivacy
          })
        )
      }
    }
  })
}
