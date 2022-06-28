/* eslint-env mocha */
import {expect} from 'chai'
import sinon from 'sinon'

import {shuffle} from '../src/array/index.js'

describe('@s-ui/js', () => {
  describe('array:shuffleArray', () => {
    before(() => {
      sinon.stub(Math, 'random').returns(0.5)
    })

    it('should shuffle an array', () => {
      const params = [1, 2, 3, 4, 5]
      expect(shuffle(params)).to.be.equal([1, 4, 2, 5, 3])
      expect(params).to.be.equal([1, 2, 3, 4, 5])
    })
  })
})
