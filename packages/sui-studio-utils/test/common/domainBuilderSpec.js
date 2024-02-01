/* eslint-env mocha */
import {expect} from 'chai'

import {DomainBuilder} from '../../src/index.js'

describe('DomainBuilder', () => {
  describe('when a useCase is mocked', () => {
    const domainBuilder = DomainBuilder.extend({domain: {get: () => {}}})
    it('should return the mocked response', async () => {
      const domain = domainBuilder.for({useCase: 'get_products'}).respondWith({success: 'mocked-response'}).build()
      expect(await domain.get('get_products').execute()).to.equal('mocked-response')
    })
  })

  describe('when config is mocked', () => {
    const domainBuilder = DomainBuilder.extend({
      domain: {get: () => {}},
      config: 'mocked-config'
    })
    it('should return the mocked response', async () => {
      const domain = domainBuilder.build()
      expect(await domain.get('config')).to.equal('mocked-config')
    })
  })
})
