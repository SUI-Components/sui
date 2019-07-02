/* eslint-env mocha */
import {expect} from 'chai'
import {
  parseQueryString,
  toQueryString,
  arrayToCommaQueryString
} from '../src/string/index'

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
  describe('string:arrayToCommaQueryString', () => {
    it('should convert params array to comma separated object params', () => {
      const paramsArray = {a: 1, b: 2, c: [3, 4]}
      const params = 'a=1&b=2&c=3,4'
      expect(unescape(arrayToCommaQueryString(paramsArray))).to.deep.equal(
        params
      )
    })
  })
})
