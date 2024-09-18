import {getConfig} from '../../config.js'
import {checkAnalyticsGdprIsAccepted, getGdprPrivacyValue} from '../../tcf.js'

/**
 * Get user traits from global analytics object and put in the object
 * @param {string} gdprPrivacyValue Determine if we have user consents
 * @returns {object} User traits with to add
 */
const getUserTraits = gdprPrivacyValue => {
  const isUserTraitsEnabled = getConfig('isUserTraitsEnabled')
  const user = window.analytics.user()
  const isGdprAccepted = checkAnalyticsGdprIsAccepted(gdprPrivacyValue)
  const userId = user.id()

  return {
    anonymousId: user.anonymousId(),
    ...(userId && {userId}),
    ...(isGdprAccepted && isUserTraitsEnabled && user.traits())
  }
}

export const userTraits = async ({payload, next}) => {
  const gdprPrivacyValue = await getGdprPrivacyValue()

  let userTraits
  try {
    userTraits = getUserTraits(gdprPrivacyValue)
  } catch (error) {
    console.error(error) // eslint-disable-line
  }

  payload.obj.context = {
    ...payload.obj.context,
    traits: {
      ...payload.obj.context.traits,
      ...userTraits
    }
  }

  next(payload)
}
