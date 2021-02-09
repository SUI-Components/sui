import {expect} from 'chai'
import {
  buildRequestUrl,
  __RewireAPI__ as utilsRewireAPI
} from '../../server/utils'
import {getMockedRequest, multiSiteMapping} from './fixtures'

describe('[sui-ssr] Critical CSS Middleware', () => {
  describe('With a multi site config', () => {
    const multiSiteConfig = {
      protocol: 'https',
      host: {
        bikes: 'www.bikes.com',
        trucks: 'www.trucks.com'
      }
    }

    beforeEach(() => {
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
        getMockedRequest('www.bikes.com')
      )

      expect(requestUrl).to.equal('https://www.bikes.com/')
    })

    it('Should create the request URL properly in a dev environment', () => {
      const requestUrl = buildRequestUrl(
        multiSiteConfig,
        getMockedRequest('dev.trucks.com')
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
        getMockedRequest('www.bikes.com')
      )

      expect(requestUrl).to.equal('https://www.bikes.com/')
    })

    it('Should create the request URL properly in a dev environment', () => {
      const requestUrl = buildRequestUrl(
        regularConfig,
        getMockedRequest('dev.bikes.com')
      )

      expect(requestUrl).to.equal('https://www.bikes.com/')
    })
  })

  describe('Without config', () => {
    it('Should create the request URL properly', () => {
      const requestUrl = buildRequestUrl({}, getMockedRequest('www.bikes.com'))

      expect(requestUrl).to.equal('http://www.bikes.com/')
    })

    it('Should create the request URL properly in a dev environment', () => {
      const requestUrl = buildRequestUrl({}, getMockedRequest('dev.bikes.com'))

      expect(requestUrl).to.equal('http://dev.bikes.com/')
    })
  })
})
