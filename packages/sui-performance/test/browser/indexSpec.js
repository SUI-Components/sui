import {expect} from 'chai'
import sinon from 'sinon'

import {waitFor} from '@testing-library/react'

import {delayTask, delayTaskUntilUrgent} from '../../src/index.js'

describe('delayTask', () => {
  it('should execute function', async () => {
    const callback = sinon.spy()

    delayTask().then(callback)

    await waitFor(() => expect(callback.called).to.be.true)
  })
})

describe('delayTaskUntilUrgent', () => {
  it('should execute function', async () => {
    const callback = sinon.spy()

    delayTaskUntilUrgent().then(callback)

    await waitFor(() => expect(callback.called).to.be.true)
  })
})
