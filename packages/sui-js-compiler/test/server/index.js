const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const fs = require('fs-extra')
const {expect} = require('chai')
const path = require('path')

const libPath = path.join(__dirname, 'lib')
const libFilePath = path.join(libPath, 'example.js')

describe('@s-ui/js-compiler', () => {
  afterEach(() => fs.remove(libPath))
  beforeEach(() => fs.remove(libPath))

  it('compiles a /src folder with a JavaScript with JSX file and output to /lib', async () => {
    const {stdout} = await exec('npx sui-js-compiler', {
      cwd: __dirname
    })

    const compiledFilenames = await fs.readdir(libPath)

    expect(compiledFilenames).to.eql(['example.js', 'example.test.js'])

    expect(stdout).to.contain('[sui-js-compiler]')

    const compiledFile = await fs.readFile(libFilePath, 'utf-8')

    expect(compiledFile).to.contain('react/jsx-runtime')
    expect(compiledFile).to.contain('_jsx')

    expect(compiledFile).to.contain('applyDecoratedDescriptor')
    expect(compiledFile).to.contain('createClass')
    expect(compiledFile).to.contain('regeneratorRuntime')
  })

  it('when the "ignore" option exists, it exclude all the file matching the passed patterns', async () => {
    const {stdout} = await exec(
      'npx sui-js-compiler --ignore="./src/**.test.js"',
      {
        cwd: __dirname
      }
    )

    const compiledFilenames = await fs.readdir(libPath)

    expect(compiledFilenames).to.eql(['example.js'])

    expect(stdout).to.contain('[sui-js-compiler]')

    const compiledFile = await fs.readFile(libFilePath, 'utf-8')

    expect(compiledFile).to.contain('react/jsx-runtime')
    expect(compiledFile).to.contain('_jsx')

    expect(compiledFile).to.contain('applyDecoratedDescriptor')
    expect(compiledFile).to.contain('createClass')
    expect(compiledFile).to.contain('regeneratorRuntime')
  })
})
