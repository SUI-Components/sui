import {expect} from 'chai'
import childProcess from 'node:child_process'
import util from 'node:util'

const exec = util.promisify(childProcess.exec)

describe('Publish contracts', () => {
  it('should check there are no Pact files to be published', async () => {
    const {stdout} = await exec(
      'sui-test-contract publish --broker-url "https://my-contract-tests-broker.com"'
    )

    expect(stdout).to.contain('No pact files found')
  })
})
