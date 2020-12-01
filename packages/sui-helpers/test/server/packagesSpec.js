import {expect} from 'chai'
import {getPackageJson} from '../../packages.js'

describe.only('[sui-helpers] packages.js utils', () => {
  describe('getPackageJson', () => {
    it('returns the info from a existent package.json file', () => {
      const {version} = getPackageJson(`${__dirname}/fixtures`)
      expect(version).to.equal('1.0.0')
    })

    it('returns an empty object from an inexistent package.json file', () => {
      const packageJson = getPackageJson(`non-existent-path`)
      expect(packageJson).to.include({})
    })
  })
})
