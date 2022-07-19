#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const path = require('path')
const {readFileSync, rmSync, writeFileSync} = require('fs')
const {copyFile} = require('fs/promises')
const ncp = require('copy-paste')
const webpack = require('webpack')

const linkLoaderConfigBuilder = require('@s-ui/bundler/loaders/linkLoaderConfigBuilder')
const serverConfigFactory = require('../compiler/server.js')
const {removeMarkedTags} = require('../scripts/remove-tags.js')

const CWD = process.cwd()
const BUILD_SERVER_PATH = path.join(CWD, 'server')
const PUBLIC_PATH = path.join(CWD, 'public')
const SRC_PATH = path.join(CWD, 'src')

program
  .option('-C, --clean', 'Remove build folder before create a new one')
  .option(
    '-l, --link-package [package]',
    'Replace each occurrence of this package with an absolute path to this folder',
    (v, m) => {
      m.push(v)
      return m
    },
    []
  )
  .option('-V, --verbose', 'Verbose output')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Build a production ready ssr server')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-ssr build')
    console.log('')
  })
  .parse(process.argv)

const {clean, linkPackage, verbose} = program.opts()

if (clean) {
  console.log('Removing previous build...')
  rmSync(BUILD_SERVER_PATH, {force: true, recursive: true})
}

const build = () =>
  new Promise((resolve, reject) => {
    const config = serverConfigFactory({outputPath: BUILD_SERVER_PATH})
    const packagesToLink = linkPackage || []

    const nextConfig = packagesToLink.length
      ? linkLoaderConfigBuilder({
          config,
          packagesToLink
        })
      : config

    webpack(nextConfig).run(async (error, stats) => {
      if (error) return reject(error)

      const jsonStats = stats.toJson()

      if (stats.hasErrors()) {
        jsonStats.errors.map(error => console.log(error))
        return reject(new Error('Webpack build failed'))
      }

      if (verbose && stats.hasWarnings()) {
        console.log('Webpack generated the following warnings: ')
        jsonStats.warnings.map(warning => console.log(warning))
      }

      const [serverEntryPoint] = jsonStats.assetsByChunkName.main
      const SERVER_ENTRY_POINT = path.join(BUILD_SERVER_PATH, serverEntryPoint)

      const html = readFileSync(path.join(PUBLIC_PATH, 'index.html'), 'utf-8')
      const htmlWithoutThirdParties = removeMarkedTags(html)
      writeFileSync(
        path.join(PUBLIC_PATH, 'index_without_third_parties.html'),
        htmlWithoutThirdParties,
        'utf-8'
      )

      // copy 404.html and 500.html from public
      const [copy404, copy500] = await Promise.allSettled([
        copyFile(
          path.join(SRC_PATH, '404.html'),
          path.join(PUBLIC_PATH, '404.html')
        ),
        copyFile(
          path.join(SRC_PATH, '500.html'),
          path.join(PUBLIC_PATH, '500.html')
        )
      ])

      copy404.status === 'fulfilled' && console.log('404.html copied!')
      copy500.status === 'fulfilled' && console.log('500.html copied!')

      verbose && console.log(`Webpack stats: ${stats}`)
      console.log(`Server entry point copy to clipboard ${SERVER_ENTRY_POINT}`)
      ncp.copy(SERVER_ENTRY_POINT)

      resolve()
    })
  })

;(async () => {
  await build()
})()
