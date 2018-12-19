/* eslint-env mocha */
import {expect} from 'chai'
import {parseQueryString, toQueryString} from '../src/string/index'

describe('@s-ui/js', () => {
  describe('when working with query params', () => {
    it('should convert to string', () => {
      const params = {a: 1, b: 'test'}
      const query = 'a=1&b=test'
      expect(toQueryString(params)).to.be.equal(query)
    })

    it('should parse to object', () => {
      const query = '?a=1&b=test'
      const params = {a: '1', b: 'test'}
      expect(parseQueryString(query)).to.deep.equal(params)
    })
  })
})
