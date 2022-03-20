#!/usr/bin/env node
/* eslint no-console:0 */

import program from 'commander'
import {createRequire} from 'module'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

program.version(version, '    --version')

program.command('components', 'Update several metrics about sui-components')

program.parse(process.argv)
