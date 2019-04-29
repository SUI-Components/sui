import sinon from 'sinon'
import {expect} from 'chai'
import axios from 'axios'
import suiAnalytics from '../src'

const FAKE_WRITE_KEY = 'FAKE_WRITE_KEY'
const AUTH_HEADER = window.btoa(`${FAKE_WRITE_KEY}:`)
const SEGMENT_API = 'https://api.segment.io/v1'

// what if click before lib loaded?
// retries?
// split if size too big, Segment’s API will respond with 400 Bad Request if these limits are exceeded.

describe('#Analytics', () => {
  const analytics = suiAnalytics(FAKE_WRITE_KEY)

  let axiosStub
  let anonymousId

  beforeEach(() => {
    axiosStub = sinon.stub(axios, 'post')
  })

  afterEach(() => {
    axiosStub.restore()
  })

  describe('#identify', () => {
    const identifyData = {
      traits: {
        name: 'Peter Gibbons',
        email: 'peter@initech.com',
        plan: 'premium',
        logins: 5
      },
      userId: '97980cfea0067'
    }

    it('should sent the right data', async () => {
      await analytics.identify(identifyData)
      const args = axiosStub.getCall(0).args[1]
      expect(axiosStub.calledOnce).to.be.true
      expect(axiosStub.getCall(0).args[0]).to.equal(`${SEGMENT_API}/identify`)
      expect(args.traits).to.deep.equal(identifyData.traits)
      expect(args.anonymousId).to.not.be.undefined
      // save the current anonymousId in order to check if its used afterwards
      anonymousId = args.anonymousId
      expect(args.userId).to.equal(identifyData.userId)
      expect(typeof args.context).to.equal('object')
      expect(args.originalTimestamp).to.exist
      expect(args.type).to.equal('identify')
    })
  })

  describe('#screen', () => {
    const screenData = {
      type: 'page',
      name: 'Home',
      properties: {
        title: 'Welcome | Initech',
        url: 'http://www.initech.com'
      }
    }

    it('should sent the right data', async () => {
      await analytics.screen(screenData)
      const args = axiosStub.getCall(0).args[1]
      expect(axiosStub.calledOnce).to.be.true
      expect(axiosStub.getCall(0).args[0]).to.equal(`${SEGMENT_API}/screen`)
      expect(args.properties).to.deep.equal(screenData.properties)
      expect(args.traits).to.be.undefined
      expect(args.anonymousId).to.equal(anonymousId)
      expect(args.type).to.be.equal('screen')
      expect(args.userId).to.equal(screenData.userId)
      expect(typeof args.context).to.equal('object')
      expect(args.originalTimestamp).to.exist
      expect(args.type).to.equal('screen')
    })
  })

  describe('#track', () => {
    const trackData = {
      type: 'track',
      event: 'Registered',
      properties: {
        plan: 'Pro Annual',
        accountType: 'Facebook'
      }
    }

    it('should sent the right data', async () => {
      await analytics.track(trackData)
      const args = axiosStub.getCall(0).args[1]
      expect(axiosStub.calledOnce).to.be.true
      expect(axiosStub.getCall(0).args[0]).to.equal(`${SEGMENT_API}/track`)
      expect(args.properties).to.deep.equal(trackData.properties)
      expect(args.traits).to.be.undefined
      expect(args.anonymousId).to.not.be.undefined
      expect(args.type).to.be.equal('track')
      expect(args.event).to.be.equal(trackData.event)
      expect(args.userId).to.equal(trackData.userId)
      expect(typeof args.context).to.equal('object')
      expect(args.originalTimestamp).to.exist
      expect(args.type).to.equal('track')
    })
  })

  describe('when a request is done', () => {
    const fakeData = {
      anonymousId: 'anonymousId'
    }

    it('should send the right headers', async () => {
      await analytics.track(fakeData)
      const headers = axiosStub.getCall(0).args[2].headers
      expect(headers).to.deep.equal({
        Authorization: `Basic ${AUTH_HEADER}`,
        'Content-Type': 'application/json'
      })
    })
  })
})
