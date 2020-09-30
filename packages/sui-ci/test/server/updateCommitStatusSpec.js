import {expect} from 'chai'

import {mockGitHubRequest} from './utils'
import {updateCommitStatus} from '../../src'

const DEFAULT_PARAMS = {
  auth: 'auth',
  commit: 'commit-sha',
  stateKey: 'OK',
  targetUrl: 'https://example.com',
  topic: 'install',
  repoSlug: 'SUI-Components/sui-components'
}

describe('sui-ci', () => {
  describe('update-commit-status', () => {
    it('calls GitHub Api to update status of a commit', done => {
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
  })
})
