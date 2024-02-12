#!/usr/bin/env node
import {createRequire} from 'module'

import program from 'commander'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

program.version(version, '    --version')

program.command('browser', 'Run tests in the browser').alias('b')

program.command('server', 'Run tests in node').alias('s')

program.parse(process.argv)
