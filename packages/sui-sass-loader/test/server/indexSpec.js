const assert = require('assert')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const rmdir = require('rimraf')

const clearCRLF = raw => raw.replace(/\r/g, '').trim()
const readFile = file => fs.readFileSync(path.join(__dirname, file), 'utf8')

function handleError(err, stats, done) {
  if (err) {
    console.error(err.stack || err)
    if (err.details) {
      console.error(err.details)
    }
    done(err)
    return false
  }

  const info = stats.toJson()
  if (stats.hasErrors()) {
    console.log(info.errors)
    done(info.errors)
    return false
  }

  return true
}

function runSimpleTest(done, fixtureName, compiledFileName = 'index') {
  const config = require('./fixtures/' + fixtureName + '/webpack.config.js')
  const compiler = webpack(config)

  compiler.run((err, stats) => {
    if (!handleError(err, stats, done)) return

    try {
      assert.equal(stats.errors, undefined)

      const css = readFile(`runtime/${fixtureName}/${compiledFileName}.css`)
      const expect = readFile(`fixtures/${fixtureName}/expect.css`)

      assert.equal(clearCRLF(css), clearCRLF(expect))

      done()
    } catch (err) {
      console.error(err)
      done(err)
    }
  })
}

describe('test sass-loader', function () {
  /**
   * First test needs a lot of time to boot up. We still don't know exactly why, but a high timeout is needed to avoid breaking tests on CI.
   */
  this.timeout(60000)

  const runtimeDir = path.join(__dirname, 'runtime')

  after(done => {
    rmdir(runtimeDir, done)
  })

  before(done => {
    rmdir(runtimeDir, done)
  })

  it('should load normal sass file', function (done) {
    runSimpleTest(done, 'normal')
  })

  it('should load sass file with data option', function (done) {
    runSimpleTest(done, 'with-data')
  })

  it('should compile without options', function (done) {
    runSimpleTest(done, 'simple')
  })

  it('should auto remove BOM header', function (done) {
    runSimpleTest(done, 'bom-issue')
  })

  it('should resolve files with double extensions', function (done) {
    runSimpleTest(done, 'double-extensions')
  })

  it('should be able to skip import in comment', function (done) {
    runSimpleTest(done, 'comment-import')
  })

  it('should be able to resolve @import paths (#39)', function (done) {
    runSimpleTest(done, 'data-import-issue')
  })

  it('should pass options to sass.render (#53)', function (done) {
    runSimpleTest(done, 'pass-output-style')
  })

  it('should support base64 fonts', function (done) {
    runSimpleTest(done, 'base-64-fonts')
  })

  it('should support alias from Webpack', function (done) {
    runSimpleTest(done, 'with-alias')
  })

  it('should support modified resolve modules from Webpack', function (done) {
    runSimpleTest(done, 'with-resolve-modules')
  })

  it('should accept a different sass implementation', function (done) {
    runSimpleTest(done, 'with-sass')
  })

  it('should compile files loaded async', function (done) {
    runSimpleTest(done, 'async', 'async')
  })

  it('should handle files with @use', function (done) {
    runSimpleTest(done, 'with-use')
  })

  it('should handle themes and default values', function (done) {
    runSimpleTest(done, 'using-variables-with-default')
  })

  it('should load normal sass file without url resolving', function (done) {
    const config = require('./fixtures/normal-no-url-resolve/webpack.config.js')
    const compiler = webpack(config)

    compiler.run((err, stats) => {
      if (!handleError(err, stats, done)) return

      try {
        assert.equal(stats.errors, undefined)

        const css = readFile('runtime/normal-no-url-resolve/index.css')
        const expect = readFile('fixtures/normal-no-url-resolve/expect.css')

        assert.equal(clearCRLF(css), clearCRLF(expect))

        const css2 = readFile('runtime/normal-no-url-resolve/index2.css')
        const expect2 = readFile('fixtures/normal-no-url-resolve/expect2.css')

        assert.equal(clearCRLF(css2), clearCRLF(expect2))
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
