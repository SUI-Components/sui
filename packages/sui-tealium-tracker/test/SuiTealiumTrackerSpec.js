/* eslint-env mocha */
import {expect} from 'chai'
import sinon from 'sinon'
import {SuiTealiumTracker} from '../src/SuiTealiumTracker'

describe.only('SuiTealiumTracker', () => {
  let suiTealiumTracker
  let sendTealiumThrottledSpy
  before(() => {
    const fixture = `
<div id='fixture'>
  <button id='tealium-click-bugged' data-tealium-bugged-tag='test_tealium_tagging'>Simple Div Tagging</button>
  <button id='tealium-click' data-tealium-tag='test_tealium_tagging'>Simple Div Tagging</button>
</div>
  `
    document.body.insertAdjacentHTML('afterbegin', fixture)
    suiTealiumTracker = new SuiTealiumTracker('test')
    suiTealiumTracker.init()
    sendTealiumThrottledSpy = sinon.spy(suiTealiumTracker, 'sendTealiumThrottled')
  })

  it('should set our customEvent var to test', () => {
    expect(suiTealiumTracker.customEventName).to.equal('test')
  })

  it('should call tealium if our button have the tag placed', (done) => {
    document.getElementById('tealium-click').click()
    setTimeout(() => {
      expect(sendTealiumThrottledSpy.callCount).to.equal(1)
      done()
    }, 200)
  })

  it('should found the tealium-tag on a dom element and call sendTealiumSpy', (done) => {
    suiTealiumTracker.checkIfNeedToTrackClick({node: document.getElementById('tealium-click')})
    setTimeout(() => {
      expect(sendTealiumThrottledSpy.callCount).to.be.equal(2)
      done()
    }, 200)
  })

  it('should NOT call tealium if our tag is not compliant', (done) => {
    document.getElementById('tealium-click-bugged').click()
    setTimeout(() => {
      expect(sendTealiumThrottledSpy.callCount).to.equal(2)
      done()
    }, 200)
  })

  it('should DONT FOUND the tealium-tag on the dom', (done) => {
    suiTealiumTracker.checkIfNeedToTrackClick({node: document.getElementById('tealium-click-bugged')})
    setTimeout(() => {
      expect(sendTealiumThrottledSpy.callCount).to.be.equal(2)
      done()
    }, 200)
  })

  it('should promote dispatchCustomEvent to our window ', () => {
    expect(window.dispatchCustomEvent).to.not.be.undefined
  })

  it('should dispatch our custom event', (done) => {
    window.dispatchCustomEvent({data: 'lol'})
    setTimeout(() => {
      expect(sendTealiumThrottledSpy.callCount).to.be.equal(3)
      done()
    }, 200)
  })
})
