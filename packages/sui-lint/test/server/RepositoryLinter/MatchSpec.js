import {expect} from 'chai'
import {stub} from 'sinon'

import {CustomFileReader, Match} from '../../src/RepositoryLinter/Match.js'

describe('Match', function () {
  beforeEach(function () {
    this.isDirStub = stub(CustomFileReader.prototype, 'isDirectory')

    this.parseYMLStub = stub(CustomFileReader.prototype, 'parseYML')
    this.parseJSONStub = stub(CustomFileReader.prototype, 'parseJSON')
    this.rawStub = stub(CustomFileReader.prototype, 'raw')
  })

  afterEach(function () {
    this.isDirStub.restore()

    this.parseYMLStub.restore()
    this.parseJSONStub.restore()
    this.rawStub.restore()
  })

  it('Should detect directories', function () {
    // Given
    this.isDirStub.returns(true)

    // When
    const match = Match.create('/dir/path')

    // Then
    expect(match.isDir).to.be.eqls(true)
  })

  it('Should detect files w/out extensions', function () {
    // Given
    this.isDirStub.returns(false)
    this.rawStub.returns('20')

    // When
    const match = Match.create('/dir/path')

    // Then
    expect(match.isDir).to.be.eqls(false)
    expect(this.rawStub.calledWith('/dir/path')).to.be.eql(true)
  })

  it('Should parse JSON files', function () {
    // Given
    this.isDirStub.returns(false)
    this.parseJSONStub.returns({a: 1})

    // When
    const match = Match.create('/dir/file.json')

    // Then
    expect(match.parsed).to.be.eqls({a: 1})
    expect(this.parseJSONStub.calledWith('/dir/file.json')).to.be.eql(true)
  })

  it('Should parse yml files', function () {
    // Given
    this.isDirStub.returns(false)
    this.parseYMLStub.returns({a: 1})

    // When
    const match = Match.create('/dir/file.yml')

    // Then
    expect(match.parsed).to.be.eqls({a: 1})
    expect(this.parseYMLStub.calledWith('/dir/file.yml')).to.be.eql(true)
  })

  it('Should parse yaml files', function () {
    // Given
    this.isDirStub.returns(false)
    this.parseYMLStub.returns({a: 1})

    // When
    const match = Match.create('/dir/file.yaml')

    // Then
    expect(match.parsed).to.be.eqls({a: 1})
    expect(this.parseYMLStub.calledWith('/dir/file.yaml')).to.be.eql(true)
  })

  it('Should read unkown files', function () {
    // Given
    this.isDirStub.returns(false)
    this.rawStub.returns('Hello')

    // When
    const match = Match.create('/dir/file.txt')

    // Then
    expect(match.raw).to.be.eqls('Hello')
    expect(match.parsed).to.be.eqls(undefined)
    expect(this.rawStub.calledWith('/dir/file.txt')).to.be.eql(true)
  })
})
