import {dispatchEvent} from '@s-ui/js/lib/events'

import {getConfig} from '../config.js'
import {EVENTS} from '../events.js'
import {utils} from '../middlewares/source/pageReferrer.js'

const FIELDS = {
  clientId: 'client_id',
  sessionId: 'session_id'
}

export const DEFAULT_DATA_LAYER_NAME = 'dataLayer'

export const CONSENT_STATES = {
  granted: 'granted',
  denied: 'denied'
}

const CONSENT_STATE_GRANTED_VALUE = 1
const CONSENT_STATE_DENIED_VALUE = 2

const STC = {
  QUERY: 'stc',
  SPLIT_SYMBOL: '-',
  CAMPAIGN_SPLIT_SYMBOL: ':'
}

const UTM_CAMPAIGN = 'utm_campaign'
const UTM_MEDIUM = 'utm_medium'
const UTM_SOURCE = 'utm_source'
const UTM_CONTENT = 'utm_content'
const UTM_CAMPAIGN_ID = 'utm_id'
const UTM_TERM = 'utm_term'

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

const EMPTY_STC = {medium: null, source: null, campaign: null}

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
  const dataLayerName = getConfig('googleAnalyticsDataLayer') || DEFAULT_DATA_LAYER_NAME

  // Check we have the needed config to load the script
  if (!googleAnalyticsMeasurementId) return Promise.resolve(false)
  // Create the `gtag` script
  const gtagScript = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsMeasurementId}&l=${dataLayerName}`
  // Load it and retrieve the `clientId` from Google
  return loadScript(gtagScript)
}

// Trigger GA init event just once per session.
const triggerGoogleAnalyticsInitEvent = sessionId => {
  const eventName = getConfig('googleAnalyticsInitEvent') ?? DEFAULT_GA_INIT_EVENT
  const eventPrefix = `ga_event_${eventName}_`
  const eventKey = `${eventPrefix}${sessionId}`

  if (typeof window.gtag === 'undefined') return

  // Check if the event has already been sent in this session.
  if (!localStorage.getItem(eventKey)) {
    // If not, send it.
    window.gtag('event', eventName)

    // eslint-disable-next-line no-console
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

export const trackingTagsTypes = {
  STC: 'stc',
  UTM: 'utm'
}

export const getCampaignDetails = ({needsTransformation = true} = {}) => {
  const {medium, source, campaign, content, term} = readQueryParams()

  if (!medium || !source || !campaign) return null

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

function readQueryParams() {
  const search = utils.getActualQueryString()
  const searchParams = new URLSearchParams(search)

  return getConfig('trackingTagsType') === trackingTagsTypes.UTM ? readFromUtm(searchParams) : readFromStc(searchParams)
}

function readFromStc(searchParams) {
  if (!hasStc(searchParams)) return EMPTY_STC

  const stc = searchParams.get(STC.QUERY)
  const [medium, source, campaign, content, term] = stc.split(STC.SPLIT_SYMBOL)
  return {medium, source, campaign, content, term}
}

function hasStc(searchParams) {
  return searchParams.has(STC.QUERY)
}

function readFromUtm(searchParams) {
  const campaignId = searchParams.get(UTM_CAMPAIGN_ID)
  const campaignName = searchParams.get(UTM_CAMPAIGN)
  const medium = searchParams.get(UTM_MEDIUM)
  const source = searchParams.get(UTM_SOURCE)
  const content = searchParams.get(UTM_CONTENT)
  const term = searchParams.get(UTM_TERM)
  const campaign = campaignId ? `${campaignId}${STC.CAMPAIGN_SPLIT_SYMBOL}${campaignName}` : campaignName

  // Fallback to STC if any mandatory UTM fields are missing
  const missingAnyMandatoryFields = !medium || !source || !campaign
  if (missingAnyMandatoryFields && hasStc(searchParams)) {
    return readFromStc(searchParams)
  }

  return {
    campaign,
    medium,
    source,
    content,
    term
  }
}

export const getGoogleClientId = async () => getGoogleField(FIELDS.clientId)
export const getGoogleSessionId = async () => {
  const sessionId = await getGoogleField(FIELDS.sessionId)

  triggerGoogleAnalyticsInitEvent(sessionId)

  return sessionId
}

// Unified consent state getter.
// Returns GRANTED, DENIED or undefined (default / unknown / unavailable).
export function getGoogleConsentValue(consentType = 'analytics_storage') {
  try {
    const value = window.google_tag_data?.ics?.getConsentState?.(consentType)

    if (value === CONSENT_STATE_GRANTED_VALUE) return CONSENT_STATES.granted
    if (value === CONSENT_STATE_DENIED_VALUE) return CONSENT_STATES.denied

    return undefined
  } catch (error) {
    // GTM bug when first rejection happens: keep default undefined instead of forcing DENIED
    return undefined
  }
}

// Backwards compatibility alias (previous getConsentState behavior now unified but default is undefined)
export const getConsentState = () => getGoogleConsentValue() ?? CONSENT_STATES.denied

export const setGoogleUserId = userId => {
  const googleAnalyticsMeasurementId = getConfig('googleAnalyticsMeasurementId')

  if (!googleAnalyticsMeasurementId || !userId) return

  window.gtag?.('set', 'user_id', userId)
}

/**
 * Send consents to Google Consent Mode.
 *
 * @param {'default' | 'update'} mode Mode for the consent update
 * @param {object} consents Consents object to be sent to Google Consent Mode.
 * Defaults used when not provided:
 * {
 *   analytics_storage: 'denied',
 *   ad_user_data: 'denied',
 *   ad_personalization: 'denied',
 *   ad_storage: 'denied'
 * }
 */
export const sendGoogleConsents = (mode = 'default', consents) => {
  window.gtag?.(
    'consent',
    mode,
    consents || {
      analytics_storage: CONSENT_STATES.denied,
      ad_user_data: CONSENT_STATES.denied,
      ad_personalization: CONSENT_STATES.denied,
      ad_storage: CONSENT_STATES.denied
    }
  )
}
