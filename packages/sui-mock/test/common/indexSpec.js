/* eslint-env mocha */
import {expect} from 'chai'
import {rest} from 'msw'

import {getMocker} from '../../src/index.js'

describe('sui-mock-provider | getMocker', () => {
  it('should init mocker without handlers', async () => {
    // Given
    const mocker = await getMocker()

    // Then
    expect(mocker).to.not.throw
  })

  it('should init mocker with one handler', () => {
    // Given
    const handler = rest.get('/user/:userId', (req, res, ctx) => {
      return res(
        ctx.json({
          firstName: 'John',
          lastName: 'Maverick'
        })
      )
    })

    // When
    const mocker = getMocker([handler])

    // Then
    expect(mocker).to.not.throw
  })

  it('should has isomorphic msw api', async () => {
    // Given
    const mocker = await getMocker()

    // Then
    expect(mocker).to.have.property('start')
    expect(mocker).to.have.property('stop')
    expect(mocker).to.have.property('listen')
    expect(mocker).to.have.property('close')
    expect(mocker).to.have.property('use')
    expect(mocker).to.have.property('resetHandlers')
    expect(mocker).to.have.property('restoreHandlers')
    expect(mocker).to.have.property('printHandlers')
  })
})
