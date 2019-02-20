/* eslint-env mocha */
import {expect} from 'chai'
import {suitClass} from '../src/classes/index'

describe('@s-ui/js', () => {
  describe('classes:suitClass', () => {
    it('should create a valid class name with children following convention', () => {
      const baseComponent = suitClass('baseComponent')
      const childrenComponent = baseComponent({children: 'childrenComponent'})
      expect(
        childrenComponent({element: 'element', modifier: 'modifier'})
      ).to.be.equal('baseComponent-childrenComponent-element--modifier')
    })

    it('should create a valid class name without children following convention', () => {
      const baseComponent = suitClass('baseComponent')()
      expect(
        baseComponent({element: 'element', modifier: 'modifier'})
      ).to.be.equal('baseComponent-element--modifier')
    })

    it('should create a valid class name without children nor element following convention', () => {
      const baseComponent = suitClass('baseComponent')()
      expect(baseComponent()).to.be.equal('baseComponent')
    })

    it('should create a valid class name with element', () => {
      const baseComponent = suitClass('baseComponent')()
      expect(baseComponent({element: 'element'})).to.be.equal(
        'baseComponent-element'
      )
    })
  })
})
