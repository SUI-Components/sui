/* eslint-env mocha */
import {expect} from 'chai'
import {rest} from 'msw'

import {getMocker} from '../../lib/index.js'

describe.skip('sui-mock-provider | getMocker', () => {
  it('should init mocker without handlers', () => {
    const worker = getMocker()
    expect(worker).to.not.throw
  })
  it('should init mocker with one handler', () => {
    const handler = rest.get('/user/:userId', (req, res, ctx) => {
      return res(
        ctx.json({
          firstName: 'John',
          lastName: 'Maverick'
        })
      )
    })
    expect(getMocker([handler])).to.not.throw
  })
})
