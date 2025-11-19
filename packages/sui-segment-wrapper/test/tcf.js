import {setConfig} from '../src/config.js'
import initTcfTracking from '../src/tcf.js'
import {stubTcfApi} from './stubs.js'

const simulateConsents = tcfEventObject => {
  setConfig('initialized', false)

  const simulateTcfApi = stubTcfApi(tcfEventObject)

  initTcfTracking()

  return simulateTcfApi
}

export const simulateUserDeclinedConsents = () =>
  simulateConsents({
    eventStatus: 'useractioncomplete'
  })

export const simulateUserDeclinedAnalyticsConsentsAndAcceptedAdvertisingConsents = () =>
  simulateConsents({
    eventStatus: 'useractioncomplete',
    consents: {3: true}
  })

export const simulateUserAcceptAnalyticsConsents = () =>
  simulateConsents({
    eventStatus: 'useractioncomplete',
    consents: {1: true, 8: true, 10: true}
  })

export const simulateUserAcceptAdvertisingConsents = () =>
  simulateConsents({
    eventStatus: 'useractioncomplete',
    consents: {3: true}
  })

export const simulateUserAcceptConsents = () =>
  simulateConsents({
    eventStatus: 'useractioncomplete',
    consents: {1: true, 3: true, 8: true, 10: true}
  })
