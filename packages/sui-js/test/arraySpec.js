/* eslint-env mocha */
import {expect} from 'chai'

import {shuffle} from '../src/array/index.js'

describe('@s-ui/js', () => {
  describe('array:shuffleArray', () => {
    it('should shuffle an array', () => {
      const params = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      shuffle(params)
      expect(params).to.be.not.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    })
  })
})
