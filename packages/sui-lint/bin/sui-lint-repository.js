#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path')

const program = require('commander')
const {RepositoryLinter} = require('../src/RepositoryLinter')

program
  .option('--reporter <reporter>', 'Send results to DD using sui-logger')
  .option('--output-json <outputJson>', 'Print messages errors as JSON. Default is a table')
  .parse(process.argv)

const {reporter, outputJson} = program.opts()

;(async function main() {
  const linter = RepositoryLinter.create()
  const results = await linter.lint()

  if (outputJson) console.log('\n\n')
  if (outputJson) {
    results.logJSON()
  } else {
    results.logTable()
  }
  if (outputJson) console.log('\n\n')

  if (reporter) {
    console.log('\n[sui-lint] Sending stats using the reporter\n\n', reporter)
    const reporterPath = path.isAbsolute(reporter) ? reporter : path.join(process.cwd() + '/' + reporter)
    console.log({reporter, isAbsolute: path.isAbsolute(reporter), reporterPath})
    const {RepositoryReporter} = await import(reporterPath)

    const reportered = RepositoryReporter.create()
    await reportered.map(results).send()
    results.logMonitorings()
  }
})().catch(error => {
  process.exitCode = 1
  console.error('[sui-lint]', error)
})
