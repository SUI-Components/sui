#!/usr/bin/env node

const {createServer} = require('vite')
const path = require('path')

const root = path.join(__dirname, '..', 'src')
const icons = path.resolve(process.cwd(), 'lib', '_demo.js')

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
