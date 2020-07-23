import nock from 'nock'

export const mockGitHubRequest = executeExpectations => {
  const nockedRequest = nock('https://api.github.com')
    .post(/.*/)
    .reply(200)

  nockedRequest.on('request', (req, _, rawBody) => {
    const {method, options} = req
    const {href} = options
    const body = JSON.parse(rawBody)
    executeExpectations({body, method, href})
    nockedRequest.done()
  })
}
