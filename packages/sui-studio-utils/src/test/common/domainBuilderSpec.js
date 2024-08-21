/* eslint-env mocha */
import {expect} from 'chai'
import sinon from 'sinon'

import {DomainBuilder} from '../../index.js'

describe('DomainBuilder', () => {
  const domain = {get: () => {}}
  describe('when a useCase is mocked', () => {
    const domainBuilder = DomainBuilder.extend({domain})
    it('should return the mocked response', async () => {
      const domain = domainBuilder.for({useCase: 'get_products'}).respondWith({success: 'mocked-response'}).build()
      expect(await domain.get('get_products').execute()).to.equal('mocked-response')
    })
  })

  describe('when a useCase is spied', () => {
    const domainBuilder = DomainBuilder.extend({domain})
    const spy = sinon.spy(() => {
      return 'spied-response'
    })
    it('should return the mocked response', async () => {
      const domain = domainBuilder.for({useCase: 'get_products'}).respondWith({success: spy}).build()
      expect(await domain.get('get_products').execute()).to.equal('spied-response')
      sinon.assert.calledOnce(spy)
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
