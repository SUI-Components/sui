/* eslint-env mocha */
import {expect} from 'chai'
import {asyncPipe} from '../src/pipe/index'

describe('@s-ui/js', () => {
  const textToUpperCase = async text => text.toUpperCase()
  const textToArray = text => [...text]
  const title = 'Schibsted'

  describe('async-pipe', () => {
    it('should convert title to array', async () => {
      const result = await asyncPipe(textToUpperCase, textToArray)(title)
      expect(result).to.be.an('array')
    })

    it('should be the same length as the title ', async () => {
      const result = await asyncPipe(textToUpperCase, textToArray)(title)
      expect(result).to.have.lengthOf(title.length)
    })

    it('should return the title in camelcase and array form ', async () => {
      const result = await asyncPipe(textToUpperCase, textToArray)(title)
      const expectedResult = ['S', 'C', 'H', 'I', 'B', 'S', 'T', 'E', 'D']
      expect(result).to.deep.equal(expectedResult)
    })
  })
})
