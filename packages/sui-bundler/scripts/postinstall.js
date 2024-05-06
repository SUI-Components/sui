#!/usr/bin/env node
/* eslint-disable no-console */

const crypto = require('crypto')
const fs = require('fs-extra')
const path = require('path')
const {writeFile} = require('@s-ui/helpers/file.js')

const {INIT_CWD} = process.env
const tsConfigTemplate = `\
{
  "extends": "@s-ui/bundler/tsconfig.json",
  "compilerOptions": {
    "rootDir": "./"
  },
  "include": ["src", "domain", "components"]
}`

const md5 = str => crypto.createHash('md5').update(str).digest('hex')
const TS_CONFIG_PATH = path.join(INIT_CWD, 'tsconfig.json')
const PACKAGE_JSON_CONFIG_PATH = path.join(INIT_CWD, 'package.json')

const config = require(PACKAGE_JSON_CONFIG_PATH)?.config?.['sui-bundler'] || {}

const shouldGenerateTSConfig = () => {
  try {
    if (!config?.type || config?.type !== 'typescript') return false

    if (!fs.existsSync(TS_CONFIG_PATH)) return true

    const tsConfigLocal = fs.readFileSync(TS_CONFIG_PATH, {encoding: 'utf8'})
    return md5(tsConfigLocal) !== md5(tsConfigTemplate)
  } catch (err) {
    return true
  }
}

async function main() {
  console.log('🔍 [sui-bundler postinstall] Checking if tsconfig.json is up to date...')
  if (!shouldGenerateTSConfig()) {
    console.log('✅ [sui-bundler postinstall] tsconfig.json is up to date')
    process.exit(0)
  }
  await writeFile(TS_CONFIG_PATH, tsConfigTemplate)
  console.log('❌ [sui-bundler postinstall] tsconfig.json was not up to date, so we updated it')
}

main()
