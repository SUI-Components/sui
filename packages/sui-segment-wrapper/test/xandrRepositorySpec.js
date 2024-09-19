import {expect} from 'chai'

import {USER_GDPR} from '../src/tcf.js'
import {getXandrId} from '../src/xandrRepository.js'
import {stubDocumentCookie, stubFetch} from './stubs.js'
import {waitUntil} from './utils.js'

describe('xandrRepository', () => {
  const XANDR_ID_SERVER_URL = 'https://secure.adnxs.com/getuidj'
  const XANDR_ID_COOKIE = 'adit-xandr-id'

  const givenXandrId = 'someXandrId'
  let fetchStub
  beforeEach(() => {
    fetchStub = stubFetch({
      responses: [
        {
          urlRe: /adnxs/,
          fetchResponse: xandrResponse(givenXandrId)
        }
      ]
    })
  })
  afterEach(() => {
    fetchStub.restore()
  })

  const xandrResponse = xandrId => ({uid: xandrId})

  const ACCEPTED_ADVERTISING_CONSENTS = USER_GDPR.ACCEPTED
  const DECLINED_ADVERTISING_CONSENTS = USER_GDPR.DECLINED

  it('should send the xandrId as externalId stored in cookie', () => {
    const givenXandrId = '9999'
    stubDocumentCookie(`${XANDR_ID_COOKIE}=${givenXandrId}`)
    expect(getXandrId({gdprPrivacyValueAdvertising: ACCEPTED_ADVERTISING_CONSENTS})).to.be.equal(givenXandrId)
  })

  it('should call xandr api and store the xandrId in the proper cookie', async () => {
    stubDocumentCookie()
    const xandrId = getXandrId({
      gdprPrivacyValueAdvertising: ACCEPTED_ADVERTISING_CONSENTS
    })
    expect(xandrId).to.be.null
    expect(fetchStub.firstCall.firstArg).to.be.equal(XANDR_ID_SERVER_URL)
    await waitUntil(() => document.cookie)
    expect(fetchStub.calledOnce).to.be.true
    expect(document.cookie).to.include(`${XANDR_ID_COOKIE}=${givenXandrId}`)
  })

  it('should not call xandr api', async () => {
    const cookieStub = stubDocumentCookie()
    const xandrId = getXandrId({
      gdprPrivacyValueAdvertising: DECLINED_ADVERTISING_CONSENTS
    })
    expect(xandrId).to.be.null
    cookieStub.restore()
    await waitUntil(() => false, {timeout: 20}).catch(() => {})
    expect(fetchStub.called).to.be.false
    // expect(document.cookie).to.be.empty // would be nice to check this
  })
})
