import {expect} from 'chai'
import sinon from 'sinon'

import {setConfig} from '../src/config.js'
import {getCampaignDetails} from '../src/repositories/googleRepository.js'
import suiAnalytics from '../src/index.js'
import {stubActualQueryString} from './stubs.js'
import {simulateUserAcceptConsents} from './tcf.js'

export const assertCampaignDetails = async ({queryString, expectation}) => {
  const queryStringStub = stubActualQueryString(queryString)
  const spy = sinon.stub()

  setConfig('googleAnalyticsMeasurementId', 123)
  await simulateUserAcceptConsents()
  await suiAnalytics.track(
    'fakeEvent',
    {},
    {
      integrations: {fakeIntegrationKey: 'fakeIntegrationValue'}
    },
    spy
  )

  const {context} = spy.firstCall.firstArg.obj
  const {campaign: campaignContext} = context
  const campaignDetails = getCampaignDetails()
  const campaignDetailsWithOriginalMedium = getCampaignDetails({
    needsTransformation: false
  })

  expect(campaignDetails).to.deep.equal(expectation)
  expect(campaignContext).to.deep.equal(campaignDetailsWithOriginalMedium.campaign)

  queryStringStub.restore()
}
