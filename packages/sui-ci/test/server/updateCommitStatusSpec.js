import {expect} from 'chai'
import nock from 'nock'

import updateCommitStatus from '../../src'

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
    it('calls GitHub Api to update status of a commit', () => {
      const nockedRequest = nock('https://api.github.com')
        .post(/.*/)
        .reply(200)

      nockedRequest.on('request', (req, _, rawBody) => {
        const {method, options} = req
        const {href} = options
        const body = JSON.parse(rawBody)

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
      })

      updateCommitStatus(DEFAULT_PARAMS).then(() => {
        nockedRequest.done()
      })
    })
  })
})
