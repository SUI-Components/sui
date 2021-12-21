#!/usr/bin/env node

import {serialSpawn} from '@s-ui/helpers/cli.js'
import {createRequire} from 'module'

const require = createRequire(import.meta.url)
const BIN_PATH = require.resolve('@s-ui/lint/bin/sui-lint')

const code = await serialSpawn([
  [BIN_PATH, ['js', '--staged']],
  [BIN_PATH, ['sass', '--staged']],
  ['npm', ['run', 'test']]
]).catch(err => {
  console.error(err)
  return 1
})

process.exit(code)
