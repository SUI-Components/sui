import {getCampaignDetails} from '../../repositories/googleRepository.js'

export const campaignContext = ({payload, next}) => {
  const campaignDetails = getCampaignDetails({needsTransformation: false})

  payload.obj.context = {
    ...payload.obj.context,
    ...campaignDetails
  }

  next(payload)
}
