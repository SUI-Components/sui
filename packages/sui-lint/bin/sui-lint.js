#!/usr/bin/env node
import {createRequire} from 'module'

import program from 'commander'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

program.version(version, '    --version')

program.command('js', 'lint javascript files').command('sass', 'lint sass files')

program.parse(process.argv)
