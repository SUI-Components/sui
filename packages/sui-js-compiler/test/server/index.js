import {promisify} from 'util'
import {exec as execCallback} from 'child_process'

import fsExtra from 'fs-extra'
import {expect} from 'chai'
import {join, dirname} from 'path'

import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const {remove, readdir, readFile} = fsExtra

const exec = promisify(execCallback)

const libPath = join(__dirname, 'lib')
const libFilePath = join(libPath, 'example.js')

describe('@s-ui/js-compiler', () => {
  afterEach(() => remove(libPath))
  beforeEach(() => remove(libPath))

  it('compiles a /src folder with a JavaScript with JSX file and output to /lib', async () => {
    const {stdout} = await exec('node ../../bin.js', {
      cwd: __dirname
    })

    const compiledFilenames = await readdir(libPath)

    expect(compiledFilenames).to.eql(['example.js', 'example.test.js'])

    expect(stdout).to.contain('[sui-js-compiler]')

    const compiledFile = await readFile(libFilePath, 'utf-8')

    console.log(compiledFile)
    expect(compiledFile).to.contain('eact/jsx-runtime')
    expect(compiledFile).to.contain('_jsx')

    expect(compiledFile).to.contain('applyDecoratedDescriptor')
    expect(compiledFile).to.contain('regeneratorRuntime')
  })

  it('when the "ignore" option exists, it exclude all the file matching the passed patterns', async () => {
    const {stdout} = await exec(
      `node ../../bin.js --ignore="./src/**.test.js" --cwd=${__dirname}`,
      {
        cwd: __dirname
      }
    )

    const compiledFilenames = await readdir(libPath)

    expect(compiledFilenames).to.eql(['example.js'])

    expect(stdout).to.contain('[sui-js-compiler]')

    const compiledFile = await readFile(libFilePath, 'utf-8')

    expect(compiledFile).to.contain('eact/jsx-runtime')
    expect(compiledFile).to.contain('_jsx')

    expect(compiledFile).to.contain('applyDecoratedDescriptor')
    expect(compiledFile).to.contain('regeneratorRuntime')
  })
})
