import {expect} from 'chai'

import {createUrlFrom, resolveRouteOptions} from '../../src/extract-from-app.js'

describe('@s-ui/critical-css extract-from-app', () => {
  describe('createUrlFrom', () => {
    it('should build the url from a route given as a plain string', () => {
      expect(createUrlFrom({hostname: 'http://localhost', pathOptions: '/es'})).to.equal('http://localhost/es')
    })

    it('should build the url from the "url" of a route given as an object', () => {
      expect(createUrlFrom({hostname: 'http://localhost', pathOptions: {url: '/es'}})).to.equal('http://localhost/es')
    })

    it('should build one url per entry when "url" is a list', () => {
      expect(createUrlFrom({hostname: 'http://localhost', pathOptions: {url: ['/es', '/en']}})).to.deep.equal([
        'http://localhost/es',
        'http://localhost/en'
      ])
    })
  })

  describe('resolveRouteOptions', () => {
    it('should apply the requiredClassNames of the config to a route given as a plain string', () => {
      const config = {requiredClassNames: ['.sui-Card']}

      expect(resolveRouteOptions({pathOptions: '/es', config})).to.deep.equal({
        requiredClassNames: ['.sui-Card'],
        retries: 3
      })
    })

    it('should apply the requiredClassNames of the config to a route that does not declare its own', () => {
      const config = {requiredClassNames: ['.sui-Card']}

      expect(resolveRouteOptions({pathOptions: {url: '/es'}, config}).requiredClassNames).to.deep.equal(['.sui-Card'])
    })

    it('should let a route override the requiredClassNames of the config', () => {
      const config = {requiredClassNames: ['.sui-Card']}
      const pathOptions = {url: '/es', requiredClassNames: ['.sui-List']}

      expect(resolveRouteOptions({pathOptions, config}).requiredClassNames).to.deep.equal(['.sui-List'])
    })

    it('should let a route opt out of the requiredClassNames of the config with an empty list', () => {
      const config = {requiredClassNames: ['.sui-Card']}
      const pathOptions = {url: '/es', requiredClassNames: []}

      expect(resolveRouteOptions({pathOptions, config}).requiredClassNames).to.deep.equal([])
    })

    it('should leave the requiredClassNames undefined when neither the config nor the route declares any', () => {
      expect(resolveRouteOptions({pathOptions: {url: '/es'}}).requiredClassNames).to.equal(undefined)
    })

    it('should default the retries to 3', () => {
      expect(resolveRouteOptions({pathOptions: '/es'}).retries).to.equal(3)
    })

    it('should apply the retries of the config', () => {
      expect(resolveRouteOptions({pathOptions: '/es', config: {retries: 5}}).retries).to.equal(5)
    })

    it('should let a route override the retries of the config', () => {
      const pathOptions = {url: '/es', retries: 1}

      expect(resolveRouteOptions({pathOptions, config: {retries: 5}}).retries).to.equal(1)
    })

    it('should respect a route asking for 0 retries instead of falling back to the config', () => {
      const pathOptions = {url: '/es', retries: 0}

      expect(resolveRouteOptions({pathOptions, config: {retries: 5}}).retries).to.equal(0)
    })

    it('should not throw when the route has no options at all', () => {
      expect(resolveRouteOptions({pathOptions: undefined, config: {requiredClassNames: ['.sui-Card']}})).to.deep.equal({
        requiredClassNames: ['.sui-Card'],
        retries: 3
      })
    })
  })
})
