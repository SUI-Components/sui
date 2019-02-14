/* eslint-env mocha */
import {expect} from 'chai'
import {asyncPipe} from '../src/pipe/index'

describe('@s-ui/js', () => {
  const textToUpperCase = async text => text.toUpperCase()
  const textToArray = text => [...text]
  const title = 'Schibsted'

  const asyncInc = async number => number + 1
  const inc = number => number + 1

  describe('async-pipe', () => {
    it('should add several incs', async () => {
      const result = await asyncPipe(asyncInc, inc, asyncInc)(0)
      expect(result).to.be.eql(3)
    })

    xit('should convert title to array', async () => {
      const result = await asyncPipe(textToUpperCase, textToArray)(title)
      expect(result).to.be.an('array')
    })

    xit('should be the same length as the title ', async () => {
      const result = await asyncPipe(textToUpperCase, textToArray)(title)

      expect(result).to.have.lengthOf(title.length)
    })

    xit('should return the title in camelcase and array form ', async () => {
      const result = await asyncPipe(textToUpperCase, textToArray)(title)
      const expectedResult = ['S', 'C', 'H', 'I', 'B', 'S', 'T', 'E', 'D']
      expect(result).to.deep.equal(expectedResult)
    })
  })
})
