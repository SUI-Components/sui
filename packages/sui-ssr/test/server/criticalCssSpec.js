import {expect} from 'chai'
import {
  buildRequestUrl,
  __RewireAPI__ as utilsRewireAPI
} from '../../server/utils'

const _getMockedRequest = hostname => ({
  get: () => {},
  url: '/',
  hostname,
  protocol: 'http'
})

// eslint-disable-next-line
describe.only('Critical CSS Middleware', () => {
  describe('With a multi site config', () => {
    const multiSiteConfig = {
      protocol: 'https',
      host: {
        bikes: 'www.bikes.com',
        trucks: 'www.trucks.com'
      }
    }

    beforeEach(() => {
      const multiSiteMapping = {
        'www.bikes.com': 'bikes',
        'www.trucks.com': 'trucks',
        'dev.trucks.com': 'trucks',
        default: 'bikes'
      }
      utilsRewireAPI.__Rewire__('multiSiteMapping', multiSiteMapping)
      utilsRewireAPI.__Rewire__('multiSiteKeys', Object.keys(multiSiteMapping))
      utilsRewireAPI.__Rewire__('isMultiSite', true)
    })

    afterEach(() => {
      utilsRewireAPI.__ResetDependency__('multiSiteMapping')
      utilsRewireAPI.__ResetDependency__('multiSiteKeys')
      utilsRewireAPI.__ResetDependency__('isMultiSite')
    })

    it('Should create the request URL properly', () => {
      const requestUrl = buildRequestUrl(
        multiSiteConfig,
        _getMockedRequest('www.bikes.com')
      )

      expect(requestUrl).to.equal('https://www.bikes.com/')
    })

    it('Should create the request URL properly in a dev environment', () => {
      const requestUrl = buildRequestUrl(
        multiSiteConfig,
        _getMockedRequest('dev.trucks.com')
      )

      expect(requestUrl).to.equal('https://www.trucks.com/')
    })
  })

  describe('With a regular config', () => {
    const regularConfig = {
      protocol: 'https',
      host: 'www.bikes.com'
    }

    it('Should create the request URL properly', () => {
      const requestUrl = buildRequestUrl(
        regularConfig,
        _getMockedRequest('www.bikes.com')
      )

      expect(requestUrl).to.equal('https://www.bikes.com/')
    })

    it('Should create the request URL properly in a dev environment', () => {
      const requestUrl = buildRequestUrl(
        regularConfig,
        _getMockedRequest('dev.bikes.com')
      )

      expect(requestUrl).to.equal('https://www.bikes.com/')
    })
  })

  describe('Without config', () => {
    it('Should create the request URL properly', () => {
      const requestUrl = buildRequestUrl({}, _getMockedRequest('www.bikes.com'))

      expect(requestUrl).to.equal('http://www.bikes.com/')
    })

    it('Should create the request URL properly in a dev environment', () => {
      const requestUrl = buildRequestUrl({}, _getMockedRequest('dev.bikes.com'))

      expect(requestUrl).to.equal('http://dev.bikes.com/')
    })
  })
})
