const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const fs = require('fs-extra')
const {expect} = require('chai')
const path = require('path')

const libPath = path.join(__dirname, 'lib')
const libFilePath = path.join(libPath, 'example.js')

describe('@s-ui/js-compiler', () => {
  after(() => fs.remove(libPath))
  before(() => fs.remove(libPath))

  it('compile a /src folder with a JavaScript with JSX file and output to /lib', async () => {
    const {stdout} = await exec('npx sui-js-compiler', {
      cwd: __dirname
    })

    expect(stdout).to.contain('[sui-js-compiler]')

    const compiledFile = await fs.readFile(libFilePath, 'utf-8')

    expect(compiledFile).to.contain('react/jsx-runtime')
    expect(compiledFile).to.contain('/*#__PURE__*/')
    expect(compiledFile).to.contain('_jsx')

    expect(compiledFile).to.contain('applyDecoratedDescriptor')
    expect(compiledFile).to.contain('createClass')
    expect(compiledFile).to.contain('regeneratorRuntime')
  })
})
