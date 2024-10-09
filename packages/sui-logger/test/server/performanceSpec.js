import {expect} from 'chai'
import sinon from 'sinon'

import * as loggerPkg from '../../src/logger.js'

const Trackers = {
  create: () => {}
}

describe('Core Web Vitals Logger', () => {
  let trackerStub
  let TrackersCreateStub

  beforeEach(() => {
    trackerStub = {emit: sinon.stub()}
    TrackersCreateStub = sinon.stub(Trackers, 'create').returns(trackerStub)
  })

  afterEach(() => {
    TrackersCreateStub.restore()
  })

  it('should send INP performance metrics', () => {
    const {cwv} = loggerPkg.default({Trackers})
    const inpMetrics = {
      name: 'cwv.inp',
      amount: '872',
      path: '/:lang',
      target: 'div.event-target',
      loadState: 'dom-content-loaded',
      eventType: 'click',
      deviceMemory: 8,
      effectiveType: '4g',
      hardwareConcurrency: 10
    }

    cwv({...inpMetrics})

    const [
      event,
      {name, amount, path, target, loadState, eventType, deviceMemory, effectiveType, hardwareConcurrency}
    ] = trackerStub.emit.getCall(0).args

    expect(event).to.equal('PERFORMANCE_LOG')
    expect(name).to.equal('cwv.inp')
    expect(amount).to.equal('872')
    expect(path).to.equal('/:lang')
    expect(target).to.equal('div.event-target')
    expect(loadState).to.equal('dom-content-loaded')
    expect(eventType).to.equal('click')
    expect(deviceMemory).to.equal(8)
    expect(effectiveType).to.equal('4g')
    expect(hardwareConcurrency).to.equal(10)
  })
})
