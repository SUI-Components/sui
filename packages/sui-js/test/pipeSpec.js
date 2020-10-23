/* eslint-env mocha */
import {expect} from 'chai'
import pipe from '../src/pipe/index'

describe('@s-ui/js', () => {
  const textToUpperCase = text => text.toUpperCase()
  const textToArray = text => [...text]
  const title = 'Schibsted'

  const inc = number => number + 1

  describe('when we use the pipe method ', () => {
    it('should add several incs', async () => {
      const result = await pipe(inc, inc, inc)(0)
      expect(result).to.be.eql(3)
    })

    xit('should convert title to array', () => {
      expect(pipe(textToUpperCase, textToArray)(title)).to.be.an('array')
    })
    xit('should be the same length as the title ', () => {
      expect(pipe(textToUpperCase, textToArray)(title)).to.have.lengthOf(
        title.length
      )
    })
    xit('should return the title in camelcase and array form ', () => {
      expect(pipe(textToUpperCase, textToArray)(title)).to.deep.equal([
        'S',
        'C',
        'H',
        'I',
        'B',
        'S',
        'T',
        'E',
        'D'
      ])
    })
  })
})
