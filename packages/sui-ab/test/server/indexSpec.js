import {expect} from 'chai'
import SuiAB from '../../src'
import OptimizelyAdapter from '../../src/adapters/optimizely'

describe('@s-ui ab', () => {
  it('works with the default adapter', done => {
    const ab = new SuiAB()
    ab.getEnabledFeatures({userId: 123}).then(features => {
      expect(features).to.be.an('array')
      done()
    })
  })

  it('works with Optimizely Adapter', done => {
    const ab = new SuiAB({
      adapter: new OptimizelyAdapter({sdkKey: 'UBBRRUe2rbyipQXPW9972'})
    })

    ab.getEnabledFeatures({userId: 123}).then(features => {
      expect(features).to.be.an('array')
      done()
    })
  })
})
