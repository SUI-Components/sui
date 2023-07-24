#!/usr/bin/env node

import {resolve} from 'path'

import {build} from 'vite'

const {pathname: root} = new URL('../src', import.meta.url)

const outDir = resolve(process.cwd(), './public')
const icons = resolve(process.cwd(), 'lib', '_demo.js')

console.log('[sui-svg] Preparing build with icons...')

await build({
  root,
  optimizeDeps: {
    include: [
      'classnames',
      'prop-types',
      'react',
      'react/jsx-runtime',
      'react-dom'
    ]
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
