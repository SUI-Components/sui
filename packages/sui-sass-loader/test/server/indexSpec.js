const assert = require('assert')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const rmdir = require('rimraf')

const clearCRLF = raw => raw.replace(/\r/g, '').trim()

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
    if (!handleError(err, stats, done)) {
      return
    }

    try {
      assert.equal(stats.errors, undefined)

      const css = fs.readFileSync(
        path.join(__dirname, `runtime/${fixtureName}/${compiledFileName}.css`),
        'utf8'
      )
      const expect = fs.readFileSync(
        path.join(__dirname, `fixtures/${fixtureName}/expect.css`),
        'utf8'
      )

      assert.equal(clearCRLF(css), clearCRLF(expect))

      done()
    } catch (err) {
      console.error(err)
      done(err)
    }
  })
}

describe.only('test sass-loader', function() {
  this.timeout(10000)

  const runtimeDir = path.join(__dirname, 'runtime')

  beforeEach(done => {
    rmdir(runtimeDir, done)
  })

  it('should load normal sass file', function(done) {
    runSimpleTest(done, 'normal')
  })

  it('should load sass file with data option', function(done) {
    runSimpleTest(done, 'withData')
  })

  it('should compile without options', function(done) {
    runSimpleTest(done, 'simple')
  })

  it('should auto remove BOM header', function(done) {
    runSimpleTest(done, 'bom-issue')
  })

  it('should resolve files with double extensions', function(done) {
    runSimpleTest(done, 'double-extensions')
  })

  it('should be able to skip import in comment', function(done) {
    runSimpleTest(done, 'comment-import')
  })

  it('should be able to resolve @import paths (#39)', function(done) {
    runSimpleTest(done, 'data-import-issue')
  })

  it('should pass options to sass.render (#53)', function(done) {
    runSimpleTest(done, 'pass-output-style')
  })

  it('should load normal sass file without url resolving', function(done) {
    const config = require('./fixtures/normal-no-url-resolve/webpack.config.js')
    const compiler = webpack(config)

    compiler.run((err, stats) => {
      if (!handleError(err, stats, done)) {
        return
      }

      try {
        assert.equal(stats.errors, undefined)

        const css = fs.readFileSync(
          path.join(__dirname, 'runtime/normal-no-url-resolve/index.css'),
          'utf8'
        )
        const expect = fs.readFileSync(
          path.join(__dirname, 'fixtures/normal-no-url-resolve/expect.css'),
          'utf8'
        )

        assert.equal(clearCRLF(css), clearCRLF(expect))

        const css2 = fs.readFileSync(
          path.join(__dirname, 'runtime/normal-no-url-resolve/index2.css'),
          'utf8'
        )
        const expect2 = fs.readFileSync(
          path.join(__dirname, 'fixtures/normal-no-url-resolve/expect2.css'),
          'utf8'
        )

        assert.equal(clearCRLF(css2), clearCRLF(expect2))
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('should accept a different sass implementation', function(done) {
    runSimpleTest(done, 'withSass')
  })

  it('should compile files loaded async', function(done) {
    runSimpleTest(done, 'async', 'async')
  })
})
