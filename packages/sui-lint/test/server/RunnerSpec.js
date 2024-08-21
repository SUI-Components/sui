import {expect} from 'chai'
import {stub} from 'sinon'

import {Match} from '../../src/RepositoryLinter/Match.js'
import {Runner} from '../../src/RepositoryLinter/Runner.js'

describe('Runner', function () {
  beforeEach(function () {
    this.syncStub = stub()
    this.matchCreateStub = stub(Match, 'create')
  })

  afterEach(function () {
    this.syncStub.reset()
    this.matchCreateStub.restore()
  })

  it('Should return a list of matches', function () {
    this.syncStub.returns(['path/file.json'])

    Runner.create({sync: this.syncStub}).assertion('**/*.json')

    expect(this.matchCreateStub.firstCall.firstArg).to.be.eql('path/file.json')
    expect(this.syncStub.firstCall.firstArg).to.be.eql('**/*.json')
  })
})
