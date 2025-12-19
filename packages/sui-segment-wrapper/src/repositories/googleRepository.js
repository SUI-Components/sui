import {getConfig} from '../config.js'
import {utils} from '../middlewares/source/pageReferrer.js'

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
const EMPTY_STC = {medium: null, source: null, campaign: null}

export const waitForGAData = () => {
  return new Promise(resolve => {
    if (window.__GA4_DATA) {
      console.log('[segment-wrapper] GA4 data already available!')
      resolve(window.__GA4_DATA)

      return
    }

    console.log('[segment-wrapper] Waiting for GTM...')

    /**
     * @param {{clientId: any, sessionId: any}} data
     */
    window.resolveGAData = data => {
      console.log('[segment-wrapper] GTM has delivered the data.')
      resolve(data)
    }
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
    campaign_medium: (needsTransformation && STC_MEDIUM_TRANSFORMATIONS[medium]) || medium,
    ...(typeof name !== 'undefined' && {campaign_id: id}),
    campaign_name: name ?? id,
    campaign_source: source,
    ...(needsContent && {campaign_content: content}),
    ...(typeof term !== 'undefined' && {campaign_term: term})
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
  if (!userId) return

  window.gtag?.('set', 'user_id', userId)
}

export function initDataLayer() {
  window.dataLayer = window.dataLayer || []

  window.dataLayer.push({...getCampaignDetails()})
}
