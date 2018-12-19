/* eslint-env mocha */
import {expect} from 'chai'
import {parseQueryString, toQueryString} from '../src/string/index'

describe('@s-ui/js', () => {
  describe('when working with query params', () => {
    const input = {a: 1, b: 'test'}
    const query = 'a=1&b=test'
    const output = {a: '1', b: 'test'}

    it('should convert to string', () => {
      expect(toQueryString(input)).to.be.equal(query)
    })

    it('should parse to object', () => {
      expect(parseQueryString(query)).to.deep.equal(output)
    })
  })
})
