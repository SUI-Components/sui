/* eslint-env mocha */
import {expect} from 'chai'

import {
  fromArrayToCommaQueryString,
  getRandomString,
  highlightText,
  parseQueryString,
  toQueryString
} from '../src/string/index.js'

describe('@s-ui/js', () => {
  describe('string:toQueryString', () => {
    it('should convert object params to query string', () => {
      const params = {a: 1, b: 'test'}
      const query = 'a=1&b=test'
      expect(toQueryString(params)).to.be.equal(query)
    })

    it('should convert object params to query string with arrayFormat comma option', () => {
      const queryParams = {a: 1, b: 'lorem/ipsum', m: [1, 2, 3]}
      const options = {arrayFormat: 'comma'}
      const queryString = toQueryString(queryParams, options)

      const expected = 'a=1&b=lorem%2Fipsum&m=1%2C2%2C3'
      expect(expected).to.be.equal(queryString)
    })

    it('should convert object params to query string with arrayFormat comma option and no encoding', () => {
      const queryParams = {a: 1, b: 'lorem/ipsum', m: [1, 2, 3]}
      const options = {arrayFormat: 'comma', encode: false}
      const queryString = toQueryString(queryParams, options)

      const expected = 'a=1&b=lorem/ipsum&m=1,2,3'
      expect(expected).to.be.equal(queryString)
    })

    it('should convert object params to query string with arrayFormat repeat and delimiter :', () => {
      const queryParams = {a: 1, b: 'test', m: [1, 2]}
      const options = {arrayFormat: 'repeat', delimiter: ':'}
      const queryString = toQueryString(queryParams, options)

      const expected = 'a=1:b=test:m=1:m=2'
      expect(expected).to.be.equal(queryString)
    })

    it('should convert object params to query string with question mark query prefix', () => {
      const queryParams = {a: 1}
      const options = {addQueryPrefix: true}
      const queryString = toQueryString(queryParams, options)

      const expected = '?a=1'
      expect(expected).to.be.equal(queryString)
    })

    it('should convert object params to query string without null values', () => {
      const queryParams = {a: [1, null, 3]}
      const options = {skipNulls: true}
      const queryString = toQueryString(queryParams, options)

      const expected = 'a[0]=1&a[2]=3'
      expect(expected).to.be.equal(queryString)
    })
  })
  describe('string:parseQueryString', () => {
    it('should convert query string to object params', () => {
      const query = '?a=1&b=test'
      const params = {a: '1', b: 'test'}
      expect(parseQueryString(query)).to.deep.equal(params)
    })

    it('should convert query string to object params with comma option', () => {
      const query = '?a=1&b=test&m=1,2,3'
      const options = {comma: true}
      const parsedQueryParams = parseQueryString(query, options)

      const expected = {a: '1', b: 'test', m: ['1', '2', '3']}
      expect(parsedQueryParams).to.deep.equal(expected)
    })

    it('should convert query string to object params with delimiter option', () => {
      const query = '?a=b:c=d'
      const options = {delimiter: ':'}
      const parsedQueryParams = parseQueryString(query, options)

      const expected = {a: 'b', c: 'd'}
      expect(parsedQueryParams).to.deep.equal(expected)
    })
  })
  describe('string:fromArrayToCommaQueryString', () => {
    it('should convert params array to comma separated object params', () => {
      const paramsArray = {a: 1, b: 2, c: [3, 4]}
      const params = 'a=1&b=2&c=3,4'
      expect(fromArrayToCommaQueryString(paramsArray)).to.deep.equal(params)
    })
  })
  describe('string:getRandomString', () => {
    it('should get a random string', () => {
      const randomString = getRandomString()
      expect(randomString).to.be.an('string')
      expect(randomString).to.have.lengthOf(15)
    })
  })
  describe('string:highlightText', () => {
    it('should highlight text', () => {
      const highlightedText = highlightText({
        value: 'Cálaca',
        query: 'ca',
        startTag: `<strong>`,
        endTag: '</strong>'
      })
      expect(highlightedText).to.be.an('string')
      expect(highlightedText).to.be.equal(`<strong>Cá</strong>la<strong>ca</strong>`)
    })
  })
})
