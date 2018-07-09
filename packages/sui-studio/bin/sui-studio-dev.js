#!/usr/bin/env node

const path = require('path')

const config = require('@s-ui/bundler/webpack.config.dev')
const startDevServer = require('@s-ui/bundler/bin/sui-bundler-dev')

const {PWD} = process.env

startDevServer({
  ...config,
  context: path.join(__dirname, '..', 'workbench', 'src'),
  resolve: {
    alias: {
      component: path.join(PWD, 'components', 'atom', 'badge', 'src'),
      demo: path.join(PWD, 'demo', 'atom', 'badge')
    }
  }
})
