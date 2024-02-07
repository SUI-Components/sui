#!/usr/bin/env node

import {resolve} from 'path'

import {createServer} from 'vite'

const {pathname: root} = new URL('../src', import.meta.url)

const icons = resolve(process.cwd(), 'lib', '_demo.js')

console.log('[sui-svg] Preparing server with icons...')

const server = await createServer({
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
  server: {
    fs: {
      strict: false
    }
  }
})
await server.listen()

console.log('[sui-svg] Server is ready! ✅')
server.printUrls()
