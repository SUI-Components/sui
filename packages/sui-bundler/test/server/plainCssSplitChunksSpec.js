const {expect} = require('chai')
const path = require('path')

const CONFIG_PATH = require.resolve('../../shared/config.js')
const INDEX_PATH = require.resolve('../../shared/index.js')
const MODULE_PATH = require.resolve('../../shared/plain-css-split-chunks.js')

function loadWithConfig(cssInAppStyles = []) {
  delete require.cache[CONFIG_PATH]
  delete require.cache[INDEX_PATH]
  delete require.cache[MODULE_PATH]

  require.cache[CONFIG_PATH] = {
    id: CONFIG_PATH,
    filename: CONFIG_PATH,
    loaded: true,
    exports: {
      config: {cssInAppStyles},
      extractComments: false,
      sourceMap: false,
      supportLegacyBrowsers: true,
      cacheDirectory: path.resolve(process.cwd(), '.sui/cache')
    }
  }

  return require('../../shared/plain-css-split-chunks.js')
}

describe('plainCssSplitChunks', () => {
  afterEach(() => {
    delete require.cache[CONFIG_PATH]
    delete require.cache[INDEX_PATH]
    delete require.cache[MODULE_PATH]
  })

  it('returns empty object when cssInAppStyles is not configured', () => {
    const {plainCssSplitChunks} = loadWithConfig([])
    expect(plainCssSplitChunks()).to.deep.equal({})
  })

  it('returns plugins array with one plugin when cssInAppStyles has packages', () => {
    const {plainCssSplitChunks} = loadWithConfig(['@adv-mt/ui', '@adv-mt/theme'])
    const result = plainCssSplitChunks()

    expect(result).to.have.property('plugins')
    expect(result.plugins).to.be.an('array').with.lengthOf(1)
  })

  it('plugin has an apply method', () => {
    const {plainCssSplitChunks} = loadWithConfig(['@adv-mt/ui'])
    const result = plainCssSplitChunks()

    expect(result.plugins[0]).to.have.property('apply')
    expect(result.plugins[0].apply).to.be.a('function')
  })

  it('plugin taps into thisCompilation hook', () => {
    const {plainCssSplitChunks} = loadWithConfig(['@adv-mt/ui'])
    const result = plainCssSplitChunks()

    const taps = []
    const fakeCompiler = {
      hooks: {
        thisCompilation: {
          tap: (name, fn) => taps.push({name, fn})
        }
      }
    }

    result.plugins[0].apply(fakeCompiler)
    expect(taps).to.have.lengthOf(1)
    expect(taps[0].name).to.equal('CssInAppStyles')
  })
})
