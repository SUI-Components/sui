import {expect} from 'chai'
import fs from 'fs'
import path from 'path'

import {
  getPackagesPaths,
  getPackageJson,
  resolveLazyNPMBin
} from '../../packages.js'

const PACKAGE_JSON_CONTENT = {
  name: 'package-name',
  version: '1.0.0',
  dependencies: {
    a: '1.0.0'
  },
  devDependencies: {
    b: '2.0.0'
  }
}

describe('[sui-helpers] packages.js utils', () => {
  before(() => {
    const fileContent = JSON.stringify(PACKAGE_JSON_CONTENT, null, 2)
    fs.writeFileSync(path.join(__dirname, 'package.json'), fileContent)
  })

  after(() => {
    fs.unlinkSync(path.join(__dirname, 'package.json'))
  })

  describe('getPackageJson', () => {
    it('returns the info from a existent package.json file', () => {
      const {version} = getPackageJson(__dirname)
      expect(version).to.equal('1.0.0')
    })

    it('returns an empty object from an inexistent package.json file', () => {
      const packageJson = getPackageJson(`non-existent-path`)
      expect(packageJson).to.include({})
    })
  })

  describe('getPackagesPaths', () => {
    it('returns a function to pass packages and get the paths', () => {
      const deps = getPackagesPaths(__dirname)(['@s-ui/test', 'package'])
      expect(deps[0]).to.include('/packages/sui-helpers/test/server/@s-ui/test')
      expect(deps[1]).to.include('/packages/sui-helpers/test/server/package')
    })
  })

  describe.skip('resolveLazyNPMBin', () => {
    it('install a lazy dependency for the binary and return', async function() {
      this.timeout(30000) // allow npm install to have plenty of time
      const bin = await resolveLazyNPMBin(
        '.bin/premove',
        'premove@3.0.1',
        __dirname
      )
      expect(bin).to.include('premove/bin.js')
    })
  })
})
