#!/usr/bin/env node
/* eslint-disable no-console */

const webpack = require('webpack')
const log = require('../shared/log.js')
const config = require('../webpack.config.prod.js')
const fs = require('fs')
const {getSpawnPromise} = require('@s-ui/helpers/cli.js')

;(async () => {
  log.processing('🔎 Analyzing Bundle...\n')
  webpack({...config, profile: true, stats: true}).run((error, stats) => {
    if (error) {
      log.error('Error analyzing the build')
      throw new Error(error)
    }

    log.success('Compilation done!')

    const filePath = `${process.cwd()}/public/stats.json`

    fs.writeFileSync(filePath, JSON.stringify(stats.toJson()), {
      encoding: 'utf8'
    })

    getSpawnPromise('npx --yes webpack-bundle-analyzer', [filePath])
  })
})()
