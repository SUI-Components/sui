import {expect} from 'chai'
import {
  getSpawnPromise,
  parallelSpawn,
  serialSpawn,
  showError,
  showWarning
} from '../../cli.js'
import sinon from 'sinon'

describe('[sui-helpers] cli.js utils', () => {
  describe('getSpawnPromise', () => {
    it('should spawn correct command and return a promise with success exit code', () => {
      getSpawnPromise('ls', ['-l']).then(EXIT_CODE => {
        expect(EXIT_CODE).to.equal(0)
      })
    })

    it('should try spawn incorrect command and return a promise with error exit code', () => {
      getSpawnPromise('non-existent-command', ['error']).then(EXIT_CODE => {
        expect(EXIT_CODE).to.equal(1)
      })
    })
  })

  describe('parallelSpawn', () => {
    beforeEach(() => {
      sinon.stub(console, 'log')
    })

    it('spawn several commands in children processes, in parallel', done => {
      parallelSpawn([
        ['sleep', ['1 && echo true']],
        ['echo', ['secondCall']]
      ]).then(() => {
        const calls = console.log.getCalls()
        const firstEcho = calls.findIndex(call =>
          call.firstArg.includes('firstCall')
        )
        const secondEcho = calls.findIndex(call =>
          call.firstArg.includes('secondCall')
        )
        expect(secondEcho < firstEcho).to.be.true
        done()
      })
    })

    afterEach(() => {
      console.log.restore()
    })
  })

  describe('serialSpawn', () => {
    beforeEach(() => {
      sinon.stub(console, 'log')
    })

    it('spawn several commands in children processes, in series', done => {
      serialSpawn([
        ['sleep', ['1 && echo true']],
        ['echo', ['secondCall']]
      ]).then(() => {
        const calls = console.log.getCalls()
        const firstEcho = calls.findIndex(call =>
          call.firstArg.includes('firstCall')
        )
        const secondEcho = calls.findIndex(call =>
          call.firstArg.includes('secondCall')
        )
        expect(firstEcho < secondEcho).to.be.true
        done()
      })
    })

    afterEach(() => {
      console.log.restore()
    })
  })

  describe('showError', () => {
    beforeEach(() => {
      sinon.stub(console, 'error')
      sinon.stub(process, 'exit')
    })

    it('exits the programm with an error code', () => {
      showError('Test Error')
      const consoleMsg = console.error.getCall(0).firstArg
      // check we're calling console.error with the red color and the expected msg
      expect(consoleMsg).to.equal('\x1B[31m✖ Error: Test Error\n\x1B[0m')
      // also we check we're exiting the process with the correct exit code
      expect(process.exit.calledWith(1)).to.be.true
    })

    afterEach(() => {
      console.error.restore()
      process.exit.restore()
    })
  })

  describe('showWarning', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn')
    })

    it('shows a warning to the console', () => {
      showWarning('Test Warning')
      const consoleMsg = console.warn.getCall(0).firstArg
      // check we're calling console.warn with the red color and the expected msg
      expect(consoleMsg).to.equal('\u001b[35m⚠ Test Warning\n\u001b[0m')
    })

    afterEach(() => {
      console.warn.restore()
    })
  })
})
