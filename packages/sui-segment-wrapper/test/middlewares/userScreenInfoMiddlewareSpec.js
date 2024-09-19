import {expect} from 'chai'
import sinon from 'sinon'

import {userScreenInfo} from '../../src/middlewares/source/userScreenInfo.js'

describe('userScreenInfoMiddleware', () => {
  const fakePayload = () => ({
    obj: {
      properties: {}
    }
  })

  const fakeWindowScreen = ({width, height, pixelRatio}) => {
    window.innerWidth = width
    window.innerHeight = height
    window.devicePixelRatio = pixelRatio
  }

  it('should add the user screen info', () => {
    fakeWindowScreen({
      width: 1920,
      height: 800,
      pixelRatio: 2
    })

    const spy = sinon.spy()
    userScreenInfo({payload: fakePayload(), next: spy})
    const [{obj}] = spy.args[0]

    expect(obj.context).to.deep.equal({
      screen: {
        width: 1920,
        height: 800,
        density: 2
      }
    })
  })
})
