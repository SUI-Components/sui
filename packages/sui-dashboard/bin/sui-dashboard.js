#!/usr/bin/env node
/* eslint no-console:0 */

import {createRequire} from 'module'

import program from 'commander'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

program.version(version, '    --version')

program.command('components', 'Update several metrics about sui-components')

program.parse(process.argv)
