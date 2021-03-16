import {expect} from 'chai'
import {isCommitBreakingChange} from '../../src/check'

describe('check', () => {
  describe('isCommitBreakingChange', () => {
    it('returns true if commit is breaking change', () => {
      expect(isCommitBreakingChange({footer: 'BREAKING CHANGE'})).to.equal(true)
    })

    it('returns false if commit is not breaking change', () => {
      expect(isCommitBreakingChange({footer: ''})).to.equal(false)
    })
  })

  describe('getAllTaskArrays', () => {})
})
