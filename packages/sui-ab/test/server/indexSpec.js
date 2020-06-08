import {expect} from 'chai'
import {AB as SuiAB} from '../../src'
import OptimizelyAdapter from '../../src/adapters/optimizely'

describe('@s-ui ab', () => {
  it('works with the default adapter', done => {
    const ab = new SuiAB({userId: 123})
    ab.getEnabledFeatures().then(features => {
      expect(features).to.be.an('array')
      done()
    })
  })

  it('works with Optimizely Adapter', done => {
    const ab = new SuiAB({
      adapter: new OptimizelyAdapter({sdkKey: 'UBBRRUe2rbyipQXPW9972'}),
      userId: 123
    })

    ab.getEnabledFeatures().then(features => {
      console.log(features)
      expect(features).to.be.an('array')
      done()
    })
  })
})
