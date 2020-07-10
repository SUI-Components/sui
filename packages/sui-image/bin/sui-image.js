#!/usr/bin/env node
/* eslint no-console:0 */

const program = require('commander')
const {version} = require('../package.json')

program.version(version, '    --version')

program.command('build', 'Builds React components studio from images files')
program.command('demo', 'Loads a local static website to show all images')

program.parse(process.argv)
