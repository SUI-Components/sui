import {utils} from '../middlewares/source/pageReferrer.js'
import {getConfig} from '../config.js'

const FIELDS = {
  clientId: 'client_id',
  sessionId: 'session_id'
}

const STC = {
  QUERY: 'stc',
  SPLIT_SYMBOL: '-',
  NAME_SPLIT_SYMBOL: ':'
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

const cachedData = {
  [FIELDS.clientId]: null,
  [FIELDS.sessionId]: null
}

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

const getGoogleField = async field => {
  const googleAnalyticsMeasurementId = getConfig('googleAnalyticsMeasurementId')

  // If `googleAnalyticsMeasurementId` is not present, don't load anything
  if (!googleAnalyticsMeasurementId) return Promise.resolve()

  return new Promise(resolve => {
    // Try to get the field from the stored info
    if (cachedData[field]) return resolve(cachedData[field])
    // if not, get it from the `GoogleAnalytics` tag
    window.gtag?.('get', googleAnalyticsMeasurementId, field, id => {
      // Cache locally the field value
      cachedData[field] = id
      // Resolve the promise with the field
      resolve(id)
    })
  })
}

export const getCampaignDetails = ({needsTransformation = true} = {}) => {
  const search = utils.getActualQueryString()
  const searchParams = new URLSearchParams(search)

  if (!searchParams.has(STC.QUERY)) return null

  const stc = searchParams.get(STC.QUERY)
  const [medium, source, originalName, term, content] = stc.split(STC.SPLIT_SYMBOL)
  const [id, name] = originalName.split(STC.NAME_SPLIT_SYMBOL)

  return {
    campaign: {
      medium: (needsTransformation && STC_MEDIUM_TRANSFORMATIONS[medium]) || medium,
      ...(typeof name !== 'undefined' && {id}),
      name: name ?? id,
      source,
      term,
      ...(typeof content !== 'undefined' && {content})
    }
  }
}

export const getGoogleClientID = () => getGoogleField(FIELDS.clientId)
export const getGoogleSessionID = () => getGoogleField(FIELDS.sessionId)
