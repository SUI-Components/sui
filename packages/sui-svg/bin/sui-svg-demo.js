#!/usr/bin/env node

import {createServer} from 'vite'
import {resolve} from 'path'

const {pathname: root} = new URL('../src', import.meta.url)

const icons = resolve(process.cwd(), 'lib', '_demo.js')

;(async () => {
  const server = await createServer({
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
    }
  })
  await server.listen()
})()
