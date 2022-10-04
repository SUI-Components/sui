import {expect} from 'chai'

import {
  isCommitBreakingChange,
  isCommitReleaseTrigger
} from '../../src/check.js'

describe('check', () => {
  describe('isCommitBreakingChange', () => {
    it('returns true if commit is breaking change', () => {
      expect(isCommitBreakingChange({footer: 'BREAKING CHANGE'})).to.equal(true)
    })

    it('returns false if commit is not breaking change', () => {
      expect(isCommitBreakingChange({footer: ''})).to.equal(false)
    })
  })

  describe('isCommitReleaseTrigger', () => {
    it('returns true if commit is of type feat', () => {
      expect(isCommitReleaseTrigger({type: 'feat'})).to.equal(true)
    })

    it('returns true if commit is of type fix', () => {
      expect(isCommitReleaseTrigger({type: 'fix'})).to.equal(true)
    })

    it('returns true if commit is of type perf', () => {
      expect(isCommitReleaseTrigger({type: 'perf'})).to.equal(true)
    })

    it('returns true if commit is of type refactor', () => {
      expect(isCommitReleaseTrigger({type: 'refactor'})).to.equal(true)
    })

    it('returns false if commit is of type chore', () => {
      expect(isCommitReleaseTrigger({type: 'chore'})).to.equal(false)
    })

    it('returns false if commit is of type test', () => {
      expect(isCommitReleaseTrigger({type: 'test'})).to.equal(false)
    })
  })

  describe('getAllTaskArrays', () => {})
})
