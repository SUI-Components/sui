import {expect} from 'chai'

import {mockGitHubRequest} from './utils'
import {updateCommitStatus} from '../../src'

const DEFAULT_PARAMS = {
  commit: 'commit-sha',
  gitHubToken: 'auth',
  repoSlug: 'SUI-Components/sui-components',
  stateKey: 'OK',
  targetUrl: 'https://example.com',
  topic: 'install'
}

describe('sui-ci', () => {
  describe('update-commit-status', () => {
    it('calls GitHub Api to update status of a commit with the correct message for install topic', done => {
      mockGitHubRequest(({method, href, body}) => {
        expect(method).to.equal('POST')
        expect(href).to.equal(
          'https://api.github.com/repos/SUI-Components/sui-components/statuses/commit-sha'
        )

        expect(body).to.eql({
          context: '@s-ui/ci (install)',
          description: 'All packages installed!',
          state: 'success',
          target_url: 'https://example.com'
        })

        done()
      })

      updateCommitStatus(DEFAULT_PARAMS)
    })

    it('calls GitHub Api to update status of a commit with a default message for unknown topic', done => {
      mockGitHubRequest(({method, href, body}) => {
        expect(method).to.equal('POST')
        expect(href).to.equal(
          'https://api.github.com/repos/SUI-Components/sui-components/statuses/commit-sha'
        )

        expect(body).to.eql({
          context: '@s-ui/ci (whatever)',
          description: 'whatever passed successfully!',
          state: 'success',
          target_url: 'https://example.com'
        })

        done()
      })

      updateCommitStatus({...DEFAULT_PARAMS, topic: 'whatever'})
    })
  })
})
