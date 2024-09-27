#!/usr/bin/env node

/* eslint-disable no-console */

// See: https://github.com/pact-foundation/pact-js/blob/51d2ae2e41c8c40e373f264ac7ba633d258604c2/examples/e2e/test/publish.js

import program from 'commander'
import path from 'node:path'

import pact from '@pact-foundation/pact-node'

import {exec} from './utils/index.js'

program
  .option('-b, --broker-url <brokerUrl>', 'Pact broker URL where the contracts will be published.')
  .parse(process.argv)

const {brokerUrl} = program.opts()
if (!brokerUrl) throw new Error('You need to specify the broker URL where the contracts will be published.')
const contractsDir = path.resolve(process.cwd(), 'contract/documents')
const {
  GITHUB_HEAD_REF,
  GITHUB_REF,
  GITHUB_REF_NAME,
  GITHUB_SHA,
  TRAVIS_PULL_REQUEST_BRANCH,
  TRAVIS_BRANCH,
  TRAVIS_COMMIT,
  TRAVIS_PULL_REQUEST_SHA
} = process.env

const branch =
  TRAVIS_PULL_REQUEST_BRANCH ||
  TRAVIS_BRANCH ||
  GITHUB_HEAD_REF ||
  GITHUB_REF_NAME ||
  GITHUB_REF ||
  exec('git rev-parse --abbrev-ref HEAD')
const consumerVersion = TRAVIS_PULL_REQUEST_SHA || TRAVIS_COMMIT || GITHUB_SHA

const options = {
  pactFilesOrDirs: [contractsDir],
  pactBroker: brokerUrl,
  tags: [branch],
  consumerVersion
}

pact
  .publishPacts(options)
  .then(() => {
    console.log(`Pact contract for consumer version ${options.consumerVersion} published!`)
    console.log(`Head over to ${brokerUrl} and login to see your published contracts.`)
    console.log(`Tags: ${branch}`)
  })
  .catch(error => {
    throw new Error(`Pact contract publishing failed: ${error}`)
  })
