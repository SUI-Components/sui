import {expect} from 'chai'
import {PDE as SuiPDE} from '../../src'
import OptimizelyAdapter from '../../src/adapters/optimizely'

describe('@s-ui ab', () => {
  it('works with the default adapter', done => {
    const ab = new SuiPDE({userId: 123})
    ab.getEnabledFeatures().then(features => {
      expect(features).to.be.an('array')
      done()
    })
  })

  it('works with Optimizely Adapter', done => {
    const optimizely = OptimizelyAdapter.createOptimizelyInstance({
      sdkKey: 'UBBRRUe2rbyipQXPW9972'
    })
    const ab = new SuiPDE({
      optimizely,
      userId: 123
    })

    ab.getEnabledFeatures().then(features => {
      expect(features).to.be.an('array')
      done()
    })
  })
})
