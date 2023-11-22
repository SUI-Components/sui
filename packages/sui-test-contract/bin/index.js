#!/usr/bin/env node
import program from 'commander'
import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

program.version(version, '--version').command('publish', 'Publish existing test contracts.')

program.parse(process.argv)
