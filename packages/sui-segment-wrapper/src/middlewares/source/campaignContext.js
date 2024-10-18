import {getConfig} from '../../config.js'
import {getCampaignDetails} from '../../repositories/googleRepository.js'

export const campaignContext = ({payload, next}) => {
  const googleAnalyticsMeasurementId = getConfig('googleAnalyticsMeasurementId')

  if (googleAnalyticsMeasurementId) {
    const campaignDetails = getCampaignDetails({needsTransformation: false})

    payload.obj.context = {
      ...payload.obj.context,
      ...campaignDetails
    }
  }

  next(payload)
}
