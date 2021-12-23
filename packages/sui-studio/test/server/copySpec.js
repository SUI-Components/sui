const fs = require('fs-extra')
const path = require('path')
const {expect} = require('chai')

const copyfiles = require('../../bin/helpers/copy')

describe('copyfiles', () => {
  const cwd = process.cwd()

  beforeEach(() => {
    fs.rm('./runtime', {recursive: true})
    process.chdir(__dirname)
  })

  afterEach(() => {
    process.chdir(cwd)
  })

  it('should copy files from src to dest', async () => {
    const from = 'fixturesCopy/**/*.js'
    const to = 'runtime'

    return copyfiles([from, to]).then(async () => {
      const out = path.join(__dirname, 'runtime/fixturesCopy/a.js')
      const stat = await fs.stat(out)
      expect(stat.isFile()).to.be.true
    })
  })

  it('should copy files from src to dest moving up one level', async () => {
    const from = 'fixturesCopy/components/**/*.js'
    const to = 'runtime'

    return copyfiles([from, to], {up: 1}).then(async () => {
      const out = path.join(
        __dirname,
        'runtime/components/atom/button/index.js'
      )
      const stat = await fs.stat(out)
      expect(stat.isFile()).to.be.true
    })
  })

  it('should copy files from src to dest and flatten it', async () => {
    const from = 'fixturesCopy/**/*.js'
    const to = 'runtime'

    return copyfiles([from, to], {flatten: true}).then(async () => {
      const out = path.join(__dirname, 'runtime/index.js')
      const stat = await fs.stat(out)
      expect(stat.isFile()).to.be.true
    })
  })
})

describe('cpx', () => {})
