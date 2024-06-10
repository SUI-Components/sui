#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

const config = require('@s-ui/bundler/webpack.config.dev')
const startDevServer = require('@s-ui/bundler/bin/sui-bundler-dev')

const {componentsFullPath} = require('./helpers/walker.js')

const {PWD} = process.env

program
  .option('-L, --link-all', 'Link all component inside the studio')
  .option(
    '-l, --link-package [package]',
    'Link all component inside the studio',
    (v, m) => {
      m.push(v)
      return m
    },
    []
  )
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-studio dev atom/button --link-all')
    console.log('    $ sui-studio dev --help')
    console.log('')
  })
  .parse(process.argv)

const {linkAll, linkPackage} = program.opts()

const entryPointsComponents = linkAll ? componentsFullPath(PWD) : []

const [componentID] = program.args
const [category, component] = componentID.split('/')

if (!category || !component) {
  console.log('The correct command is $ sui-studio dev [category]/[component]')
}

const componentPath = path.join(PWD, 'components', category, component)
const legacyTestPath = path.join(PWD, 'test', category, component)
const jestPath = path.join(componentPath, '__tests__')

const testPath = fs.existsSync(legacyTestPath) ? legacyTestPath : path.join(componentPath, 'test')
const isJestTest = fs.existsSync(jestPath)

const {cache, ...others} = config

const studioDevConfig = {
  ...others,
  context: path.join(__dirname, '..', 'workbench', 'src'),
  plugins: [
    ...config.plugins,
    new webpack.DefinePlugin({__COMPONENT_ID__: JSON.stringify(componentID), __DISABLE_TESTS__: isJestTest})
  ],
  resolve: {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      component: path.join(componentPath, 'src'),
      test: testPath,
      package: path.join(componentPath, 'package.json'),
      demo: path.join(componentPath, 'demo')
    }
  }
}

startDevServer({
  config: studioDevConfig,
  packagesToLink: [...entryPointsComponents, ...linkPackage]
})
