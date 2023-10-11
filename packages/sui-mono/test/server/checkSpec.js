import {expect} from 'chai'

import {
  getTransform,
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

  describe('getTransform', () => {
    it('should not increment status when commit is not valid', async () => {
      const status = {
        literals: {
          increment: 0,
          commits: []
        }
      }
      const packages = ['literals']
      const overrides = {}

      const transform = getTransform({status, packages, overrides})
      const commit = {
        type: 'Lokalise',
        scope: null,
        header: 'Lokalise: updates'
      }

      await new Promise(resolve => transform(commit, resolve))

      expect(status).to.be.deep.equal({
        literals: {
          increment: 0,
          commits: []
        }
      })
    })

    it('should increment status when commit is valid', async () => {
      const status = {
        literals: {
          increment: 0,
          commits: []
        }
      }
      const packages = ['literals']
      const overrides = {}

      const transform = getTransform({status, packages, overrides})
      const commit = {
        type: 'feat',
        scope: 'literals',
        header: 'updates'
      }

      await new Promise(resolve => transform(commit, resolve))

      expect(status).to.be.deep.equal({
        literals: {
          increment: 2,
          commits: [commit]
        }
      })
    })

    it('should increment status when commit is not valid but is overrided', async () => {
      const status = {
        literals: {
          increment: 0,
          commits: []
        }
      }
      const packages = ['literals']
      const overrides = {
        literals: [
          {
            regex: 'Lokalise:'
          }
        ]
      }

      const transform = getTransform({status, packages, overrides})
      const commit = {
        type: 'Lokalise',
        scope: null,
        header: 'Lokalise: updates'
      }

      await new Promise(resolve => transform(commit, resolve))

      expect(status).to.be.deep.equal({
        literals: {
          increment: 2,
          commits: [commit]
        }
      })
    })
  })
})
