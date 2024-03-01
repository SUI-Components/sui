import {expect} from 'chai'
import {Table} from 'console-table-printer'
import {stub} from 'sinon'

import {Results} from '../../src/RepositoryLinter/Results.js'

describe('Results', function () {
  beforeEach(function () {
    this.addRowStub = stub(Table.prototype, 'addRow')
    this.printTableStub = stub(Table.prototype, 'printTable')

    this.logStub = stub(Results.prototype, 'log')
  })

  afterEach(function () {
    this.addRowStub.restore()
    this.printTableStub.restore()

    this.logStub.restore()
  })

  it('Should print Happy Message it there is not messages', function () {
    const executions = [
      {
        messages: [],
        signal: false
      }
    ]
    Results.create(executions).logTable()

    expect(this.logStub.calledWith(Results.HAPPY_MESSAGE)).to.be.eq(true)
  })

  it('Should print a table with all the messages', function () {
    const executions = [
      {messages: [{rule: 'tester/node-version', message: 'Node version fail', level: 1}], signal: 12},
      {messages: [{rule: 'tester/react-version', message: 'React version fail', level: 2}], signal: 17},
      {messages: [], signal: true}
    ]
    Results.create(executions).logTable()

    // expect(this.logStub.calledWith(Results.HAPPY_MESSAGE)).to.be.eq(true)
  })
})
