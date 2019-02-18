/* eslint-env mocha */
import {expect} from 'chai'
import pipe from '../src/pipe/index'

describe('@s-ui/js', () => {
  const textToUpperCase = text => text.toUpperCase()
  const textToArray = text => text.split('')
  const title = 'Schibsted'

  describe('when we use the pipe method ', () => {
    it('should convert title to array', () => {
      expect(
        pipe(
          textToUpperCase,
          textToArray
        )(title)
      ).to.be.an('array')
    })
    it('should be the same length as the title ', () => {
      expect(
        pipe(
          textToUpperCase,
          textToArray
        )(title)
      ).to.have.lengthOf(title.length)
    })
    it('should return the title in camelcase and array form ', () => {
      expect(
        pipe(
          textToUpperCase,
          textToArray
        )(title)
      ).to.deep.equal(['S', 'C', 'H', 'I', 'B', 'S', 'T', 'E', 'D'])
    })
  })
})
