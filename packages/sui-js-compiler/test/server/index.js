import {fileURLToPath} from 'url'

import {expect} from 'chai'
import fs from 'fs-extra'
import {exec as execCallback} from 'node:child_process'
import {join} from 'node:path'
import {promisify} from 'node:util'

const exec = promisify(execCallback)

const cwd = fileURLToPath(new URL('.', import.meta.url))
const libPath = fileURLToPath(new URL('lib', import.meta.url))
const libFilePath = join(libPath, 'example.js')

describe('@s-ui/js-compiler', () => {
  beforeEach(() => fs.remove(libPath))
  afterEach(() => fs.remove(libPath))

  it('compiles a /src folder with a JavaScript with JSX file and output to /lib', async () => {
    const {stdout} = await exec('node ../../index.js', {
      cwd
    })

    const compiledFilenames = await fs.readdir(libPath)

    expect(compiledFilenames).to.eql(['example.js', 'example.test.js'])

    expect(stdout).to.contain('[sui-js-compiler]')

    const compiledFile = await fs.readFile(libFilePath, 'utf-8')

    expect(compiledFile).to.contain('react/jsx-runtime')
    expect(compiledFile).to.contain('_jsx')

    expect(compiledFile).to.contain('_async_to_generator')
    expect(compiledFile).to.contain('_ts_decorate')
    expect(compiledFile).to.contain('_ts_generator')
  })

  it('when the "ignore" option exists, it exclude all the file matching the passed patterns', async () => {
    const {stdout} = await exec(
      'node ../../index.js --ignore="./src/**.test.js"',
      {
        cwd
      }
    )

    const compiledFilenames = await fs.readdir(libPath)

    expect(compiledFilenames).to.eql(['example.js'])

    expect(stdout).to.contain('[sui-js-compiler]')

    const compiledFile = await fs.readFile(libFilePath, 'utf-8')

    expect(compiledFile).to.contain('react/jsx-runtime')
    expect(compiledFile).to.contain('_jsx')

    expect(compiledFile).to.contain('_async_to_generator')
    expect(compiledFile).to.contain('_ts_decorate')
    expect(compiledFile).to.contain('_ts_generator')
  })
})
