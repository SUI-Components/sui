import {expect} from 'chai'
import sinon from 'sinon'

import {getAdobeVisitorData} from '../src/repositories/adobeRepository.js'
import {setConfig} from '../src/config.js'
import suiAnalytics from '../src/index.js'
import {defaultContextProperties} from '../src/middlewares/source/defaultContextProperties.js'
import {pageReferrer} from '../src/middlewares/source/pageReferrer.js'
import {userScreenInfo} from '../src/middlewares/source/userScreenInfo.js'
import {userTraits} from '../src/middlewares/source/userTraits.js'
import {INTEGRATIONS_WHEN_NO_CONSENTS} from '../src/segmentWrapper.js'
import initTcfTracking, {getGdprPrivacyValue, USER_GDPR} from '../src/tcf.js'
import {
  cleanWindowStubs,
  resetReferrerState,
  stubActualLocation,
  stubDocumentCookie,
  stubGoogleAnalytics,
  stubReferrer,
  stubTcfApi,
  stubWindowObjects
} from './stubs.js'
import {
  simulateUserAcceptAdvertisingConsents,
  simulateUserAcceptAnalyticsConsents,
  simulateUserAcceptConsents,
  simulateUserDeclinedConsents
} from './tcf.js'
import {getDataFromLastTrack, waitUntil} from './utils.js'

const ACCEPTED_BOROS_COOKIE_VALUE =
  'eyJwb2xpY3lWZXJzaW9uIjoyLCJjbXBWZXJzaW9uIjoxNSwicHVycG9zZSI6eyJjb25zZW50cyI6eyIxIjp0cnVlLCIyIjp0cnVlLCIzIjp0cnVlLCI0Ijp0cnVlLCI1Ijp0cnVlLCI2Ijp0cnVlLCI3Ijp0cnVlLCI4Ijp0cnVlLCI5Ijp0cnVlLCIxMCI6dHJ1ZX19LCJzcGVjaWFsRmVhdHVyZXMiOnsiMSI6dHJ1ZX19;'
const DECLINED_BOROS_COOKIE_VALUE =
  'eyJwb2xpY3lWZXJzaW9uIjoyLCJjbXBWZXJzaW9uIjoxNSwicHVycG9zZSI6eyJjb25zZW50cyI6eyIxIjpmYWxzZSwiMiI6ZmFsc2UsIjMiOmZhbHNlLCI0IjpmYWxzZSwiNSI6ZmFsc2UsIjYiOmZhbHNlLCI3IjpmYWxzZSwiOCI6ZmFsc2UsIjkiOmZhbHNlLCIxMCI6ZmFsc2V9fSwic3BlY2lhbEZlYXR1cmVzIjp7IjEiOmZhbHNlLCIyIjpmYWxzZX19;'

describe('Segment Wrapper', function () {
  this.timeout(16000)

  beforeEach(() => {
    stubWindowObjects()
    stubGoogleAnalytics()

    window.__SEGMENT_WRAPPER = window.__SEGMENT_WRAPPER || {}
    window.__SEGMENT_WRAPPER.ADOBE_ORG_ID = '012345678@AdobeOrg'
    window.__SEGMENT_WRAPPER.TRACKING_SERVER = 'mycompany.test.net'

    window.analytics.addSourceMiddleware(userTraits)
    window.analytics.addSourceMiddleware(defaultContextProperties)
    window.analytics.addSourceMiddleware(userScreenInfo)
    window.analytics.addSourceMiddleware(pageReferrer)
  })

  afterEach(() => cleanWindowStubs())

  describe('should use correct page referrer for tracks', () => {
    let referrerStub, locationStub

    beforeEach(() => {
      resetReferrerState()
    })

    afterEach(() => {
      referrerStub.restore()
      locationStub.restore()
    })

    it('by waiting consents of the user and send correct referrers at once', async function () {
      try {
        const firstReferrer = 'https://external-page.com'
        const initialInternalLocation = 'https://internal-page.com/search'

        locationStub = stubActualLocation(initialInternalLocation)
        referrerStub = stubReferrer(firstReferrer, locationStub)

        const spy = sinon.stub()

        const trackBeforeConsents = Promise.all([
          suiAnalytics.page('Home Page', undefined, undefined, spy),
          suiAnalytics.track('First Track', undefined, undefined, spy)
        ])

        await simulateUserAcceptConsents()

        await trackBeforeConsents

        await suiAnalytics.page('Search Page', undefined, undefined, spy)
        await suiAnalytics.track('Second Track on Search Page', undefined, undefined, spy)

        expect(spy.callCount).to.equal(4)

        const {context: firstContext} = spy.getCall(0).firstArg.obj
        const {context: secondPageContext} = spy.getCall(2).firstArg.obj
        const {context: lastContext} = spy.getCall(3).firstArg.obj

        expect(firstContext.page.referrer).to.equal(firstReferrer)
        expect(secondPageContext.page.referrer).to.equal(initialInternalLocation)
        expect(lastContext.page.referrer).to.equal(initialInternalLocation)
      } catch (e) {
        console.error(e) // eslint-disable-line
      }
    })

    it('without calling page event document.referrer should be used for tracks', async function () {
      await simulateUserAcceptConsents()

      const firstReferrer = 'https://external-page.com'
      const initialInternalLocation = 'https://internal-page.com/another'

      locationStub = stubActualLocation(initialInternalLocation)
      referrerStub = stubReferrer(firstReferrer, locationStub)

      const spy = sinon.stub()
      await suiAnalytics.track('First Track', undefined, undefined, spy)

      const {context: firstContext} = spy.firstCall.firstArg.obj

      expect(firstContext.page.referrer).to.equal(firstReferrer)
    })

    it('after calling page event more than once and the referrer is external', async function () {
      const firstReferrer = 'https://external-page.com'
      const initialInternalLocation = 'https://internal-page.com/first'

      locationStub = stubActualLocation(initialInternalLocation)
      referrerStub = stubReferrer(firstReferrer, locationStub)

      const spy = sinon.stub()

      await suiAnalytics.page('Home Page', undefined, undefined, spy)
      const {context: firstPageContext} = spy.lastCall.firstArg.obj

      await suiAnalytics.track('First Track', undefined, undefined, spy)
      const {context: firstPageFirstTrackContext} = spy.lastCall.firstArg.obj

      await suiAnalytics.track('Second Track', undefined, undefined, spy)
      const {context: firstPageSecondTrackContext} = spy.lastCall.firstArg.obj

      expect(firstPageContext.page.referrer).to.equal(firstReferrer)
      expect(firstPageFirstTrackContext.page.referrer).to.equal(firstReferrer)
      expect(firstPageSecondTrackContext.page.referrer).to.equal(firstReferrer)

      await suiAnalytics.page('Second Page', undefined, undefined, spy)
      const {context: secondPageContext} = spy.lastCall.firstArg.obj

      await suiAnalytics.track('First Track on Second Page', undefined, undefined, spy)
      const {context: secondTrackContext} = spy.lastCall.firstArg.obj

      expect(secondPageContext.page.referrer).to.equal(initialInternalLocation)
      expect(secondTrackContext.page.referrer).to.equal(initialInternalLocation)
    })

    it('after calling page event more than once and not referrer set', async function () {
      const firstReferrer = ''
      const initialInternalLocation = 'https://internal-page.com/another'

      locationStub = stubActualLocation(initialInternalLocation)
      referrerStub = stubReferrer(firstReferrer, locationStub)

      const spy = sinon.stub()

      await suiAnalytics.page('Home Page', undefined, undefined, spy)
      const {context: firstPageContext} = spy.lastCall.firstArg.obj

      await suiAnalytics.track('First Track', undefined, undefined, spy)
      const {context: firstTrackContext} = spy.lastCall.firstArg.obj

      expect(firstPageContext.page.referrer).to.equal(firstReferrer)
      expect(firstTrackContext.page.referrer).to.equal(firstReferrer)

      await suiAnalytics.page('Second Page', undefined, undefined, spy)
      const {context: secondPageContext} = spy.lastCall.firstArg.obj

      await suiAnalytics.track('First Track', undefined, undefined, spy)
      const {context: secondTrackContext} = spy.lastCall.firstArg.obj

      expect(secondPageContext.page.referrer).to.equal(initialInternalLocation)
      expect(secondTrackContext.page.referrer).to.equal(initialInternalLocation)
    })
  })

  describe('when the track event is called', () => {
    it('should add anonymousId as options trait', async function () {
      await simulateUserAcceptConsents()

      const spy = sinon.stub()

      await suiAnalytics.track('fakeEvent', {}, {}, spy)
      const {context} = spy.firstCall.firstArg.obj

      expect(context.traits.anonymousId).to.deep.equal('fakeAnonymousId')
    })

    it('should send MarketingCloudId on Adobe Analytics integration', async () => {
      await simulateUserAcceptAnalyticsConsents()

      window.Visitor = {}
      window.Visitor.getInstance = sinon.stub().returns({
        getMarketingCloudVisitorID: sinon.stub().returns('fakeCloudId')
      })

      await suiAnalytics.track(
        'fakeEvent',
        {},
        {
          integrations: {fakeIntegrationKey: 'fakeIntegrationValue'}
        }
      )

      const {context} = getDataFromLastTrack()

      expect(context.integrations).to.deep.includes({
        fakeIntegrationKey: 'fakeIntegrationValue',
        'Adobe Analytics': {
          marketingCloudVisitorId: 'fakeCloudId'
        }
      })
    })

    describe('and gtag has been configured properly', () => {
      it('should send Google Analytics integration with true if user declined consents', async () => {
        // Add the needed config to enable Google Analytics
        setConfig('googleAnalyticsMeasurementId', 123)
        await simulateUserDeclinedConsents()

        await suiAnalytics.track(
          'fakeEvent',
          {},
          {
            integrations: {fakeIntegrationKey: 'fakeIntegrationValue'}
          }
        )

        const {context} = getDataFromLastTrack()

        expect(context.integrations).to.deep.includes({
          fakeIntegrationKey: 'fakeIntegrationValue',
          'Google Analytics 4': true
        })
      })

      it('should send ClientId on Google Analytics integration if user accepted consents', async () => {
        // add needed config to enable Google Analytics
        setConfig('googleAnalyticsMeasurementId', 123)

        await simulateUserAcceptConsents()

        await suiAnalytics.track(
          'fakeEvent',
          {},
          {
            integrations: {fakeIntegrationKey: 'fakeIntegrationValue'}
          }
        )

        const {context} = getDataFromLastTrack()

        expect(context.integrations).to.deep.includes({
          fakeIntegrationKey: 'fakeIntegrationValue',
          'Google Analytics 4': {
            clientId: 'fakeClientId'
          }
        })
      })
    })

    it('should add always the platform as web and the language', async () => {
      await suiAnalytics.track('fakeEvent', {fakePropKey: 'fakePropValue'})
      const {properties} = getDataFromLastTrack()

      expect(properties).to.deep.equal({
        fakePropKey: 'fakePropValue',
        platform: 'web'
      })
    })

    it('should send defaultProperties if provided', async () => {
      setConfig('defaultProperties', {site: 'mysite', vertical: 'myvertical'})

      await suiAnalytics.track('fakeEvent')

      const {properties} = getDataFromLastTrack()

      expect(properties).to.deep.equal({
        site: 'mysite',
        vertical: 'myvertical',
        platform: 'web'
      })
    })

    describe('and the TCF is handled', () => {
      it('should reset the anonymousId when the user first declines and then accepts', async () => {
        await simulateUserDeclinedConsents()

        const spy = sinon.stub()

        await suiAnalytics.track('fakeEvent', {}, {}, spy)

        expect(spy.firstCall.firstArg.obj.context.traits.anonymousId).to.equal('fakeAnonymousId')

        await simulateUserAcceptAnalyticsConsents()
        const spySecondCall = sinon.stub()

        await suiAnalytics.track('fakeEvent', {}, {}, spySecondCall)

        expect(spySecondCall.firstCall.firstArg.obj.context.traits.anonymousId).to.equal('fakeAnonymousId')
      })
    })
  })

  describe('when the identify event is called', () => {
    const DEFAULT_SEGMENT_CALLBACK_TIMEOUT = 350
    it('should call sdk identify of users that accepts consents', async function () {
      await simulateUserAcceptConsents()

      const spy = sinon.stub()

      await suiAnalytics.identify('fakeEvent', {}, {}, spy)
      await waitUntil(() => spy.callCount, {
        timeout: DEFAULT_SEGMENT_CALLBACK_TIMEOUT
      })
      expect(spy.callCount).to.equal(1)
    })

    it('should call sdk identify of user not accepts consents', async function () {
      await simulateUserDeclinedConsents()

      const spy = sinon.stub()

      await suiAnalytics.identify('fakeEvent', {}, {}, spy)
      await waitUntil(() => spy.callCount, {
        timeout: DEFAULT_SEGMENT_CALLBACK_TIMEOUT
      }).catch(() => null)
      expect(spy.callCount).to.equal(1)
    })
  })

  describe('when TCF is present on the page', () => {
    it('should track that CMP user action when declined tracking purposes', async () => {
      await simulateUserDeclinedConsents()

      const {context, properties} = getDataFromLastTrack()

      expect(properties).to.deep.equal({
        channel: 'GDPR',
        platform: 'web'
      })
      expect(context).to.deep.include({
        gdpr_privacy: 'declined',
        gdpr_privacy_advertising: 'declined'
      })
    })

    it('should track that CMP user action when accepted tracking purposes', async () => {
      await simulateUserAcceptAnalyticsConsents()
      const {context, properties} = getDataFromLastTrack()

      expect(properties).to.deep.equal({
        channel: 'GDPR',
        platform: 'web'
      })

      expect(context).to.deep.include({
        gdpr_privacy: 'accepted',
        gdpr_privacy_advertising: 'declined'
      })
    })

    it('should track that CMP user action when accepted advertising purposes', async () => {
      await simulateUserAcceptAdvertisingConsents()

      const {context, properties} = getDataFromLastTrack()

      expect(properties).to.deep.equal({
        channel: 'GDPR',
        platform: 'web'
      })
      expect(context).to.deep.include({
        gdpr_privacy: 'declined',
        gdpr_privacy_advertising: 'accepted'
      })
    })

    it('should track that CMP user action when reject all purposes', async () => {
      await simulateUserDeclinedConsents()

      const {context, properties} = getDataFromLastTrack()

      expect(properties).to.deep.equal({
        channel: 'GDPR',
        platform: 'web'
      })

      expect(context).to.deep.include({
        gdpr_privacy: 'declined',
        gdpr_privacy_advertising: 'declined'
      })
    })

    it('should set integrations all to true when reject all purposes', async () => {
      await simulateUserDeclinedConsents()

      const {context} = getDataFromLastTrack()

      expect(context.integrations).to.include({
        All: true
      })
    })

    it('should set integrations all to true when accept all purposes', async () => {
      await simulateUserAcceptConsents()

      const {context} = getDataFromLastTrack()

      expect(context.integrations).to.include({
        All: true
      })
    })

    it('should track that CMP user action when accept all purposes', async () => {
      await simulateUserAcceptConsents()

      const {context, properties} = getDataFromLastTrack()

      expect(properties).to.deep.equal({
        channel: 'GDPR',
        platform: 'web'
      })

      expect(context).to.deep.include({
        gdpr_privacy: 'accepted',
        gdpr_privacy_advertising: 'accepted'
      })
    })

    it('should send the correct gdpr_privacy field on site events after accepting CMP', async () => {
      await simulateUserAcceptAnalyticsConsents()

      await suiAnalytics.track('fakeEvent', {fakePropKey: 'fakePropValue'})
      const {context, properties} = getDataFromLastTrack()

      expect(properties).to.deep.equal({
        fakePropKey: 'fakePropValue',
        platform: 'web'
      })

      expect(context).to.deep.include({
        gdpr_privacy: 'accepted'
      })
    })

    it('should disable integrations if consents are declined', async () => {
      await simulateUserDeclinedConsents()

      await suiAnalytics.track('fakeEvent', {fakePropKey: 'fakePropValue'})
      const {context} = getDataFromLastTrack()

      expect(context.integrations).to.deep.include(INTEGRATIONS_WHEN_NO_CONSENTS)
    })

    describe('for recurrent users', () => {
      let cookiesStub

      beforeEach(() => setConfig('initialized', false))
      afterEach(() => cookiesStub.restore())

      it('read its tcf cookie with accepted purposes', async () => {
        cookiesStub = stubDocumentCookie(`borosTcf=${ACCEPTED_BOROS_COOKIE_VALUE}`)

        initTcfTracking()

        const gdprPrivacyValue = await getGdprPrivacyValue()

        expect(gdprPrivacyValue.analytics).to.equal(USER_GDPR.ACCEPTED)
        expect(gdprPrivacyValue.advertising).to.equal(USER_GDPR.ACCEPTED)
      })

      it('read its tcf cookie with declined purposes', async function () {
        cookiesStub = stubDocumentCookie(`borosTcf=${DECLINED_BOROS_COOKIE_VALUE}`)

        initTcfTracking()

        const gdprPrivacyValue = await getGdprPrivacyValue()

        expect(gdprPrivacyValue.analytics).to.equal(USER_GDPR.DECLINED)
        expect(gdprPrivacyValue.advertising).to.equal(USER_GDPR.DECLINED)
      })
    })
  })

  describe('when the MarketingCloudVisitorId is loaded via callback', () => {
    before(() => {
      stubWindowObjects()

      window.__mpi = {
        segmentWrapper: {}
      }
      window.__mpi.segmentWrapper.getCustomAdobeVisitorId = () => Promise.resolve('myCustomCloudVisitorId')
    })

    it('should use the visitor id resolved by the defined async callback function', async () => {
      await simulateUserAcceptAnalyticsConsents() // simulate already fire an analytics.track

      const {context} = getDataFromLastTrack()

      expect(context.integrations).to.deep.include({
        'Adobe Analytics': {
          marketingCloudVisitorId: 'myCustomCloudVisitorId'
        }
      })
    })
  })

  describe('when the importAdobeVisitorId config is set', () => {
    before(() => {
      setConfig('importAdobeVisitorId', true)
    })

    it('should import local Visitor Api version and create a MarketingCloudVisitorId on consents accepted', async () => {
      await simulateUserAcceptAnalyticsConsents() // simulate already fire an analytics.track

      const {version} = await getAdobeVisitorData()
      const {context} = getDataFromLastTrack()

      expect(version).to.equal('4.6.0')
      expect(context.integrations['Adobe Analytics'].marketingCloudVisitorId).to.be.a('string')
    })

    it('should define Adobe Analytics as true in integrations', async () => {
      await simulateUserDeclinedConsents() // simulate already fire an analytics.track

      const {context} = getDataFromLastTrack()

      expect(context.integrations['Adobe Analytics']).to.be.true
    })
  })

  describe('when tcfTrackDefaultProperties config is set', () => {
    beforeEach(() => {
      stubWindowObjects()
      // Adding a custom property to later check this is added for every next track
      setConfig('tcfTrackDefaultProperties', {vertical: 'fakeVertical'})
    })

    it('should add the defined custom property to the track event when CONSENTS are ACCEPTED', async () => {
      await simulateUserAcceptAnalyticsConsents()

      const {properties} = getDataFromLastTrack()

      expect(properties).to.deep.equal({
        channel: 'GDPR',
        platform: 'web',
        vertical: 'fakeVertical'
      })
    })
    it('should add the defined custom property to the track event when CONSENTS are DECLINED', async () => {
      await simulateUserDeclinedConsents()

      const {properties} = getDataFromLastTrack()

      expect(properties).to.deep.equal({
        channel: 'GDPR',
        platform: 'web',
        vertical: 'fakeVertical'
      })
    })
  })

  describe('context integrations', () => {
    before(() => {
      stubWindowObjects()

      window.__mpi = {
        segmentWrapper: {}
      }
      window.__mpi.segmentWrapper.getCustomAdobeVisitorId = () => Promise.resolve('myCustomCloudVisitorId')
    })

    it('sends an event with the actual context and traits when the consents are declined', async () => {
      const spy = sinon.stub()

      await simulateUserDeclinedConsents()
      await suiAnalytics.track(
        'fakeEvent',
        {fakePropKey: 'fakePropValue'},
        {
          anonymousId: '1a3bfbfc-9a89-437a-8f1c-87d786f2b6a',
          userId: 'fakeId',
          protocols: {
            event_version: 3
          }
        },
        spy
      )

      const {context} = getDataFromLastTrack()
      const integrations = {
        All: false,
        'Adobe Analytics': true,
        'Google Analytics 4': true,
        Personas: false,
        Webhooks: true,
        Webhook: true
      }
      const expectation = {
        anonymousId: '1a3bfbfc-9a89-437a-8f1c-87d786f2b6a',
        integrations,
        ip: '0.0.0.0',
        userId: 'fakeId',
        protocols: {event_version: 3},
        gdpr_privacy: 'declined',
        gdpr_privacy_advertising: 'declined',
        context: {
          integrations
        }
      }
      const {traits} = spy.getCall(0).firstArg.obj.context

      expect(context).to.deep.equal(expectation)
      expect(traits).to.deep.equal({
        anonymousId: 'fakeAnonymousId',
        userId: 'fakeId'
      })
    })
  })

  describe('isFirstVisit flag', () => {
    let cookiesStub

    afterEach(() => cookiesStub?.restore())

    describe('when the user hasnt interacted with the tcf modal', () => {
      beforeEach(() => {
        initTcfTracking()
      })

      it('should flag the visit as first visit', async () => {
        expect(window.__mpi.segmentWrapper.isFirstVisit).to.equal(true)
      })
    })

    describe('when the user did accept the cookies before', () => {
      beforeEach(() => {
        cookiesStub = stubDocumentCookie(`borosTcf=${ACCEPTED_BOROS_COOKIE_VALUE}`)
        initTcfTracking()
      })

      it('shouldnt flag the visit as first visit', async () => {
        expect(window.__mpi.segmentWrapper.isFirstVisit).to.equal(false)
      })
    })

    describe('when the user did decline the cookies before', () => {
      beforeEach(() => {
        cookiesStub = stubDocumentCookie(`borosTcf=${DECLINED_BOROS_COOKIE_VALUE}`)
        initTcfTracking()
      })

      it('shouldnt flag the visit as first visit', async () => {
        expect(window.__mpi.segmentWrapper.isFirstVisit).to.equal(false)
      })
    })
  })

  describe.skip('User Email to Visitor API', () => {
    let spySetCustomerIDs

    before(() => {
      stubWindowObjects()

      spySetCustomerIDs = sinon.spy()
      window.Visitor = {}
      window.Visitor.getInstance = sinon.stub().returns({
        getMarketingCloudVisitorID: sinon.stub().returns('fakeCloudId'),
        setCustomerIDs: spySetCustomerIDs
      })
    })

    it('is sent when userEmail config is set and CONSENTS are ACCEPTED', function (done) {
      setConfig('userEmail', 'USER.name+go@gmail.com') // this should be like 'username@gmail.com'

      const actionPromise = stubTcfApi()

      initTcfTracking()

      actionPromise.then(() => {
        const intervalId = setInterval(() => {
          if (spySetCustomerIDs.callCount === 1) {
            const [
              {
                hashed_email: {authState, id}
              }
            ] = spySetCustomerIDs.getCall(0).args
            expect(authState).to.equal(1)
            expect(id).to.equal('761cd16b141770ecb0bbb8a4e5962d16')
            clearInterval(intervalId)
            done()
          }
        }, 500)
      })
    })

    it('when hashedUserEmail config property is set', function (done) {
      setConfig('hashedUserEmail', '761cd16b141770ecb0bbb8a4e5962d16') // this should be like 'username@gmail.com' but hashed

      const actionPromise = stubTcfApi()

      initTcfTracking()

      actionPromise.then(() => {
        const intervalId = setInterval(() => {
          if (spySetCustomerIDs.callCount === 1) {
            const [
              {
                hashed_email: {authState, id}
              }
            ] = spySetCustomerIDs.getCall(0).args
            expect(authState).to.equal(1)
            expect(id).to.equal('761cd16b141770ecb0bbb8a4e5962d16')
            clearInterval(intervalId)
            done()
          }
        }, 500)
      })
    })
  })

  describe('xandr id to externalId', () => {
    const XANDR_ID_COOKIE = 'adit-xandr-id'

    const givenXandrId = '9999'
    beforeEach(() => {
      stubDocumentCookie(`${XANDR_ID_COOKIE}=${givenXandrId}`)
    })

    it('should send the xandrId as externalId, that where stored in a cookie', async () => {
      await simulateUserAcceptConsents()

      await suiAnalytics.track('fakeEvent')

      const {
        context: {externalIds}
      } = getDataFromLastTrack()

      expect(externalIds).to.be.instanceOf(Array)
      expect(externalIds[0]).to.be.deep.equal({
        id: givenXandrId,
        type: 'xandr_id',
        encoding: 'none',
        collection: 'users'
      })
    })

    it('should not send the xandrId if user not consented advertising', async () => {
      await simulateUserAcceptAnalyticsConsents()
      await suiAnalytics.track('fakeEvent')

      const {
        context: {externalIds}
      } = getDataFromLastTrack()
      expect(externalIds).to.be.undefined
    })

    it('should not send the xandrId if configuration sendXandrId flag is false', async () => {
      setConfig('sendXandrId', false)
      stubDocumentCookie(`${XANDR_ID_COOKIE}=${givenXandrId}`)
      await simulateUserAcceptAnalyticsConsents()
      await suiAnalytics.track('fakeEvent')

      const {
        context: {externalIds}
      } = getDataFromLastTrack()
      expect(externalIds).to.be.undefined
    })
  })
})
