import {fileURLToPath} from 'url'

import {expect} from 'chai'
import fs from 'fs-extra'
import {exec as execCallback} from 'node:child_process'
import {join} from 'node:path'
import {promisify} from 'node:util'

const DEFAULT_TIMEOUT = 9000

const exec = promisify(execCallback)
const cwd = fileURLToPath(new URL('.', import.meta.url))
const libPath = fileURLToPath(new URL('lib', import.meta.url))
const tsConfigPath = fileURLToPath(new URL('tsconfig.json', import.meta.url))
const libFilePath = join(libPath, 'example.js')

describe('@s-ui/js-compiler', () => {
  beforeEach(async () => {
    await fs.remove(libPath)
    await fs.remove(tsConfigPath)
  })

  it('should compile a "src" folder with a JavaScript file and output it to "lib"', async () => {
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
  }).timeout(DEFAULT_TIMEOUT)

  it('should exclude all the files matching the passed patterns when the "ignore" option exists', async () => {
    const {stdout} = await exec('node ../../index.js --ignore="./src/**.test.js"', {
      cwd
    })

    const compiledFilenames = await fs.readdir(libPath)

    expect(compiledFilenames).to.eql(['example.js'])
    expect(stdout).to.contain('[sui-js-compiler]')

    const compiledFile = await fs.readFile(libFilePath, 'utf-8')

    expect(compiledFile).to.contain('react/jsx-runtime')
    expect(compiledFile).to.contain('_jsx')
    expect(compiledFile).to.contain('_async_to_generator')
    expect(compiledFile).to.contain('_ts_decorate')
    expect(compiledFile).to.contain('_ts_generator')
  }).timeout(DEFAULT_TIMEOUT)

  it('should compile a "src" folder with a JSX file written in TypeScript and output it to "lib"', async () => {
    // GIVEN a "tsconfig.json" definition in the package root directory
    const tsConfig = {
      extends: '../../../../tsconfig.json',
      compilerOptions: {
        outDir: './lib',
        rootDir: './src'
      },
      exclude: ['node_modules', 'lib']
    }

    await fs.outputFile(tsConfigPath, JSON.stringify(tsConfig))

    // WHEN execute the compiler command
    const {stdout} = await exec('node ../../index.js', {
      cwd
    })
    const compiledFilenames = await fs.readdir(libPath)

    // THEN package files and types are properly compiled
    expect(stdout).to.contain('[sui-js-compiler]')
    expect(compiledFilenames).to.eql(['example.d.ts', 'example.js', 'example.test.js'])
  }).timeout(DEFAULT_TIMEOUT)
})
