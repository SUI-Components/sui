/* eslint-env mocha */
import {expect} from 'chai'
import {parseQueryString, toQueryString} from '../src/string/index'

describe('@s-ui/js', () => {
  describe('string:toQueryString', () => {
    it('should convert object params to query string', () => {
      const params = {a: 1, b: 'test'}
      const query = 'a=1&b=test'
      expect(toQueryString(params)).to.be.equal(query)
    })
  })
  describe('string:parseQueryString', () => {
    it('should convert query string to object params', () => {
      const query = '?a=1&b=test'
      const params = {a: '1', b: 'test'}
      expect(parseQueryString(query)).to.deep.equal(params)
    })
  })
})
