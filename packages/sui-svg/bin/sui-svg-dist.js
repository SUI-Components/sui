#!/usr/bin/env node

import {resolve} from 'path'

import {build} from 'vite'
import program from 'commander'

const {pathname: root} = new URL('../src', import.meta.url)

const outDir = resolve(process.cwd(), './public')
const icons = resolve(process.cwd(), 'lib', '_demo.js')

const DEFAULT_BASE = '/'

console.log('[sui-svg] Preparing build with icons...')

program
  .option('-b, --base [path]', 'Base public path')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-svg dist')
    console.log('    $ sui-svg dist --base /my/abslotute/public/path')
    console.log('    $ sui-svg dist --base https://my.full.url/public/path')
    console.log('')
  })
  .parse(process.argv)

const {base = DEFAULT_BASE} = program.opts()

await build({
  base,
  root,
  optimizeDeps: {
    include: ['classnames', 'prop-types', 'react', 'react/jsx-runtime', 'react-dom']
  },
  resolve: {
    alias: [
      {
        find: '@s-ui/svg-icons',
        replacement: () => icons
      },
      {
        find: /^~.+/,
        replacement: val => val.replace(/^~/, '')
      }
    ]
  },
  build: {
    outDir
  }
})

console.log('[sui-svg] Build is ready! ✅')
