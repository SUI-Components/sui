#!/usr/bin/env node
/* eslint no-console:0 */
import program from 'commander'

import {parallelSpawn} from '@s-ui/helpers/cli'

import {getAllTaskArrays} from '../src/run.js'

program
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Runs the given command on all the packages')
    console.log('    Commands are run in parallel, with colorless output')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-mono run-parallel npm i')
    console.log('    $ sui-mono run-parallel --help')
    console.log('')
  })
  .parse(process.argv)

parallelSpawn(getAllTaskArrays())
  .then(code => process.exit(code))
  .catch(code => process.exit(code))
