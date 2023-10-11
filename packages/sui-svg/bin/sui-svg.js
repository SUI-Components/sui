#!/usr/bin/env node

import {createRequire} from 'module'

import program from 'commander'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

program.version(version, '    --version')

program.command('build', 'Builds React components from svg files')
program.command('demo', 'Loads a local static website')
program.command('dist', 'Generates static website')

program.parse(process.argv)
