#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const webpack = require('webpack')

const config = require('@s-ui/bundler/webpack.config.dev')
const startDevServer = require('@s-ui/bundler/bin/sui-bundler-dev')

const {componentsFullPath} = require('./helpers/walker')

const {PWD} = process.env

program
  .option('--link-all', 'Link all component inside the studio')
  .option(
    '--link-package [package]',
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

const entryPointsComponents = program.linkAll ? componentsFullPath(PWD) : []

const [componentID] = program.args
const [category, component] = componentID.split('/')

if (!category || !component) {
  console.log('The correct command is $ sui-studio dev [category]/[component]')
}

const studioDevConfig = {
  ...config,
  context: path.join(__dirname, '..', 'workbench', 'src'),
  plugins: [
    ...config.plugins,
    new webpack.DefinePlugin({__COMPONENT_ID__: JSON.stringify(componentID)})
  ],
  resolve: {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      component: path.join(PWD, 'components', category, component, 'src'),
      test: path.join(PWD, 'test', category, component),
      package: path.join(
        PWD,
        'components',
        category,
        component,
        'package.json'
      ),
      demo: path.join(PWD, 'demo', category, component)
    }
  }
}

startDevServer({
  config: studioDevConfig,
  packagesToLink: [...entryPointsComponents, ...program.linkPackage]
})
