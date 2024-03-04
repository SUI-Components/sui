import {expect} from 'chai'
import {stub} from 'sinon'

import {Config} from '../../../src/RepositoryLinter/Config.js'

describe('Config', function () {
  beforeEach(function () {
    this.requireConfigStub = stub(Config.prototype, 'requireConfig')
    this.requirePkgStub = stub(Config.prototype, 'requirePkg')
  })

  afterEach(function () {
    this.requireConfigStub.reset()
    this.requirePkgStub.reset()
  })

  it('Should return a rules object', async function () {
    // Given
    const handler = {
      meta: {messages: {badVersion: 'Your react version is not 20'}},
      create: function () {}
    }
    this.requireConfigStub.returns({
      plugins: ['tester'],
      rules: {
        'tester/react-version': 1
      }
    })
    this.requirePkgStub.returns({rules: {'react-version': handler}})

    // When
    const rulesLoaded = await Config.create().load()

    // Then
    expect(this.requirePkgStub.calledWith('tester')).to.be.eql(true)
    expect(rulesLoaded).to.be.eqls({'tester/react-version': {handler, level: 1}})
  })
})
