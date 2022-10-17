import {promisify} from 'node:util'
import {exec as execCallback} from 'node:child_process'
import path from 'node:path'
import fs from 'fs-extra'
import {expect} from 'chai'

const exec = promisify(execCallback)

const libPath = path.join(__dirname, 'lib')
const libFilePath = path.join(libPath, 'example.js')

describe('@s-ui/js-compiler', () => {
  afterEach(() => fs.remove(libPath))
  beforeEach(() => fs.remove(libPath))

  it('compiles a /src folder with a JavaScript with JSX file and output to /lib', async () => {
    const {stdout} = await exec('node ../../index.js', {
      cwd: __dirname
    })

    const compiledFilenames = await fs.readdir(libPath)

    expect(compiledFilenames).to.eql(['example.js', 'example.test.js'])

    expect(stdout).to.contain('[sui-js-compiler]')

    const compiledFile = await fs.readFile(libFilePath, 'utf-8')

    console.log(compiledFile)
    expect(compiledFile).to.contain('react/jsx-runtime')
    expect(compiledFile).to.contain('_jsx')

    expect(compiledFile).to.contain('_ts_decorate')
    expect(compiledFile).to.contain('regeneratorRuntime')
  })

  it('when the "ignore" option exists, it exclude all the file matching the passed patterns', async () => {
    const {stdout} = await exec(
      'node ../../index.js --ignore="./src/**.test.js"',
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

    expect(compiledFile).to.contain('_ts_decorate')
    expect(compiledFile).to.contain('regeneratorRuntime')
  })
})
