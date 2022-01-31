#!/usr/bin/env node
import program from 'commander'
import {createRequire} from 'module'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

program.version(version, '    --version')

program.command('install', 'add precommit rules to git hook')

program.parse(process.argv)
