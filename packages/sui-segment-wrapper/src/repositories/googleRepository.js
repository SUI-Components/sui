import {dispatchEvent} from '@s-ui/js/lib/events'

import {getConfig} from '../config.js'
import {EVENTS} from '../events.js'
import {utils} from '../middlewares/source/pageReferrer.js'

const FIELDS = {
  clientId: 'client_id',
  sessionId: 'session_id'
}

const CONSENT_STATES = {
  granted: 'GRANTED',
  denied: 'DENIED'
}

const CONSENT_STATE_GRANTED_VALUE = 1
const CONSENT_STATE_DENIED_VALUE = 2

const STC = {
  QUERY: 'stc',
  SPLIT_SYMBOL: '-',
  CAMPAIGN_SPLIT_SYMBOL: ':'
}
const STC_MEDIUM_TRANSFORMATIONS = {
  aff: 'affiliate',
  dis: 'display',
  em: 'email',
  met: 'paid-metasearch',
  sem: 'paid-search',
  rt: 'display',
  sm: 'social-media',
  sp: 'paid-social',
  pn: 'push-notification',
  cs: 'cross-sites'
}
const STC_INVALID_CONTENT = 'na'
const DEFAULT_GA_INIT_EVENT = 'sui'

const loadScript = async src =>
  new Promise(function (resolve, reject) {
    const script = document.createElement('script')

    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })

export const loadGoogleAnalytics = async () => {
  const googleAnalyticsMeasurementId = getConfig('googleAnalyticsMeasurementId')

  // Check we have the needed config to load the script
  if (!googleAnalyticsMeasurementId) return Promise.resolve(false)
  // Create the `gtag` script
  const gtagScript = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsMeasurementId}`
  // Load it and retrieve the `clientId` from Google
  return loadScript(gtagScript)
}

// Trigger GA init event just once per session.
const triggerGoogleAnalyticsInitEvent = sessionId => {
  const eventName = getConfig('googleAnalyticsInitEvent') ?? DEFAULT_GA_INIT_EVENT
  const eventPrefix = `ga_event_${eventName}_`
  const eventKey = `${eventPrefix}${sessionId}`

  // Check if the event has already been sent in this session.
  if (!localStorage.getItem(eventKey)) {
    // If not, send it.
    window.gtag('event', eventName)
    console.log(`Sending GA4 event "${eventName}" for the session "${sessionId}"`)

    // And then save a new GA session hit in local storage.
    localStorage.setItem(eventKey, 'true')
    dispatchEvent({eventName: EVENTS.GA4_INIT_EVENT_SENT, detail: {eventName, sessionId}})
  }

  // Clean old GA sessions hits from the storage.
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(eventPrefix) && key !== eventKey) {
      localStorage.removeItem(key)
    }
  })
}

const getGoogleField = async field => {
  const googleAnalyticsMeasurementId = getConfig('googleAnalyticsMeasurementId')

  // If `googleAnalyticsMeasurementId` is not present, don't load anything.
  if (!googleAnalyticsMeasurementId) return Promise.resolve()

  return new Promise(resolve => {
    // If it is, get it from `gtag`.
    window.gtag?.('get', googleAnalyticsMeasurementId, field, resolve)
  })
}

export const getCampaignDetails = ({needsTransformation = true} = {}) => {
  const search = utils.getActualQueryString()
  const searchParams = new URLSearchParams(search)

  if (!searchParams.has(STC.QUERY)) return null

  const stc = searchParams.get(STC.QUERY)
  const [medium, source, campaign, content, term] = stc.split(STC.SPLIT_SYMBOL)

  if (!campaign) return null

  const [id, name] = campaign.split(STC.CAMPAIGN_SPLIT_SYMBOL)

  if (!id && !name) return null

  const needsContent = typeof content !== 'undefined' && content !== STC_INVALID_CONTENT

  return {
    campaign: {
      medium: (needsTransformation && STC_MEDIUM_TRANSFORMATIONS[medium]) || medium,
      ...(typeof name !== 'undefined' && {id}),
      name: name ?? id,
      source,
      ...(needsContent && {content}),
      ...(typeof term !== 'undefined' && {term})
    }
  }
}

export const getGoogleClientId = async () => getGoogleField(FIELDS.clientId)
export const getGoogleSessionId = async () => {
  const sessionId = await getGoogleField(FIELDS.sessionId)

  if (sessionId) {
    triggerGoogleAnalyticsInitEvent(sessionId)
  }

  return sessionId
}
export const getConsentState = () => {
  let consentValue = CONSENT_STATE_DENIED_VALUE

  try {
    consentValue = window.google_tag_data?.ics?.getConsentState?.('analytics_storage')
  } catch (error) {
    // Detected an issue getting the consent state when user rejects the consent
    // due to a bug in Google Tag Manager
    // After that first rejection the code works as expected
    console.error('Error getting consent state', error)
    consentValue = CONSENT_STATE_DENIED_VALUE
  }

  return consentValue === CONSENT_STATE_GRANTED_VALUE ? CONSENT_STATES.granted : CONSENT_STATES.denied
}

export const setGoogleUserId = userId => {
  const googleAnalyticsMeasurementId = getConfig('googleAnalyticsMeasurementId')

  if (!googleAnalyticsMeasurementId || !userId) return

  window.gtag?.('set', 'user_id', userId)
}
