import {dispatchEvent} from '@s-ui/js/lib/events'

import {createUniversalId} from './utils/hashEmail.js'
import {getConfig, isClient, setConfig} from './config.js'
const USER_DATA_READY_EVENT = 'USER_DATA_READY'

export const getUniversalIdFromConfig = () => getConfig('universalId')

export const getUniversalId = () => {
  // 1. Try to get universalId from config
  let universalId = getUniversalIdFromConfig()
  if (universalId) {
    setUniversalIdInitialized()
    return universalId
  }

  // 2. If not available, then we use the email and hash it
  const userEmail = getConfig('userEmail')
  if (userEmail) {
    universalId = createUniversalId(userEmail)
    setUniversalId(universalId)
    setUniversalIdInitialized()
    return universalId
  }

  // 3. We don't have user email, so we don't have universalId
  // but we've tried, so we set it as initialized
  setUniversalIdInitialized()
}

export const getUserDataAndNotify = () => {
  const universalId = getUniversalId()
  const userEmail = getConfig('userEmail')
  isClient && dispatchEvent({eventName: USER_DATA_READY_EVENT, detail: {universalId, userEmail}})
  return {universalId, userEmail}
}

export const setUniversalIdInitialized = () => {
  setConfig('universalIdInitialized', true)
}

export const setUniversalId = universalId => setConfig('universalId', universalId)
