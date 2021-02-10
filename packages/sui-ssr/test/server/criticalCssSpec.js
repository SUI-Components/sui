import {expect} from 'chai'
import {buildRequestUrl} from '../../server/utils'
import {getMockedRequest} from './fixtures'
import {
  buildRequestUrlWithConfig,
  buildRequestUrlWithMultiSiteConfig
} from './fixtures/utils'

describe('[sui-ssr] Critical CSS Middleware', () => {
  describe('With a multi site config', () => {
    it('Should create the request URL properly', () => {
      const requestUrl = buildRequestUrlWithMultiSiteConfig(
        getMockedRequest('www.bikes.com')
      )

      expect(requestUrl).to.equal('https://www.bikes.com/')
    })

    it('Should create the request URL properly in a dev environment', () => {
      const requestUrl = buildRequestUrlWithMultiSiteConfig(
        getMockedRequest('dev.trucks.com')
      )

      expect(requestUrl).to.equal('https://www.trucks.com/')
    })
  })

  describe('With a regular config', () => {
    it('Should create the request URL properly', () => {
      const requestUrl = buildRequestUrlWithConfig(
        getMockedRequest('www.bikes.com')
      )

      expect(requestUrl).to.equal('https://www.bikes.com/')
    })

    it('Should create the request URL properly in a dev environment', () => {
      const requestUrl = buildRequestUrlWithConfig(
        getMockedRequest('dev.bikes.com')
      )

      expect(requestUrl).to.equal('https://www.bikes.com/')
    })
  })

  describe('Without config', () => {
    it('Should create the request URL properly', () => {
      const requestUrl = buildRequestUrl(getMockedRequest('www.bikes.com'))

      expect(requestUrl).to.equal('http://www.bikes.com/')
    })

    it('Should create the request URL properly in a dev environment', () => {
      const requestUrl = buildRequestUrl(getMockedRequest('dev.bikes.com'))

      expect(requestUrl).to.equal('http://dev.bikes.com/')
    })
  })
})
