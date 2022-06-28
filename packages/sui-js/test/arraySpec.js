/* eslint-env mocha */
import {expect} from 'chai'
import sinon from 'sinon'

import {shuffle} from '../src/array/index.js'

describe('@s-ui/js', () => {
  describe('array:shuffleArray', () => {
    beforeEach(() => {
      sinon.stub(Math, 'random').returns(0.5)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should shuffle an array', () => {
      const params = [1, 2, 3, 4, 5]
      expect(shuffle(params)).to.eql([1, 4, 2, 5, 3])
      expect(params).to.eql([1, 2, 3, 4, 5])
    })
  })
})
