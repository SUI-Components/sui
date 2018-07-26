#!/usr/bin/env node

const program = require('commander')
const path = require('path')

const config = require('@s-ui/bundler/webpack.config.dev')
const startDevServer = require('@s-ui/bundler/bin/sui-bundler-dev')

const {componentsFullPath} = require('../bin/walker')

const {PWD} = process.env

program
  .option('--link-all', 'Link all component inside the studio')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-studio dev atom/button --link-all')
    console.log('    $ sui-studio dev --help')
    console.log('')
  })
  .parse(process.argv)

const entryPointsComponents = !program.linkAll
  ? {}
  : componentsFullPath(PWD).reduce((acc, componentPath) => {
      const pkg = require(path.join(componentPath, 'package.json'))
      acc[pkg.name] = path.join(componentPath, 'src')
      return acc
    }, {})

const [componentID] = program.args
const [category, component] = componentID.split('/')

if (!category || !component) {
  console.log('The correct command is $ sui-studio dev [category]/[component]')
}

const studioDevConfig = {
  ...config,
  context: path.join(__dirname, '..', 'workbench', 'src'),
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /(\.css|\.scss)$/,
        use: {loader: 'link-loader', options: {entryPointsComponents}}
      },
      {
        test: /\.jsx?$/,
        // TODO: That is crap, I need better options
        exclude: new RegExp(
          `node_modules(?!${path.sep}@s-ui${path.sep}studio(${
            path.sep
          }workbench)?${path.sep}src)`
        ),
        use: {loader: 'link-loader', options: {entryPointsComponents}}
      }
    ]
  },
  resolve: {
    alias: {
      component: path.join(PWD, 'components', category, component, 'src'),
      package: path.join(
        PWD,
        'components',
        category,
        component,
        'package.json'
      ),
      demo: path.join(PWD, 'demo', category, component)
    }
  },
  resolveLoader: {
    alias: {
      'link-loader': require.resolve('./helpers/LinkLoader')
    }
  }
}

startDevServer(studioDevConfig)
