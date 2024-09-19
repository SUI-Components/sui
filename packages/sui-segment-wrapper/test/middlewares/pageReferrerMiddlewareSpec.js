import {expect} from 'chai'
import sinon from 'sinon'

import {pageReferrer} from '../../src/middlewares/source/pageReferrer.js'
import {resetReferrerState, stubActualLocation, stubReferrer} from '../stubs.js'

describe('#pageReferrerMiddleware', () => {
  let referrerStub, locationStub

  const fakePayload = ({isPageTrack}) => ({
    obj: {
      context: {
        isPageTrack
      }
    }
  })

  beforeEach(() => {
    resetReferrerState()
  })

  afterEach(() => {
    referrerStub.restore()
    locationStub.restore()
  })

  it('should add correct referrer to context when isPageTrack is true', () => {
    const firstReferrer = 'https://external-page.com'
    const initialInternalLocation = 'https://internal-page.com/search'

    locationStub = stubActualLocation(initialInternalLocation)
    referrerStub = stubReferrer(firstReferrer, locationStub)

    const spy = sinon.spy()
    pageReferrer({payload: fakePayload({isPageTrack: true}), next: spy})
    pageReferrer({payload: fakePayload({isPageTrack: true}), next: spy})

    expect(spy.firstCall.firstArg.obj.context.page.referrer).to.equal(firstReferrer)

    expect(spy.secondCall.firstArg.obj.context.page.referrer).to.equal(initialInternalLocation)
  })
})
