import {getConfig} from '../config.js'
import {utils} from '../middlewares/source/pageReferrer.js'

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
  rt: 'retargeting',
  sm: 'social-media',
  sp: 'paid-social',
  pn: 'push-notification',
  cs: 'cross-sites'
}
const STC_INVALID_CONTENT = 'na'
const EMPTY_STC = {medium: null, source: null, campaign: null}

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
