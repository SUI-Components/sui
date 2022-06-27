#!/usr/bin/env node

/* eslint-disable no-console */

// See: https://github.com/pact-foundation/pact-js/blob/51d2ae2e41c8c40e373f264ac7ba633d258604c2/examples/e2e/test/publish.js

import program from 'commander'
import path from 'node:path'

import {versionFromGitTag} from '@pact-foundation/absolute-version'
import {Publisher} from '@pact-foundation/pact'

import {exec} from './utils/index.js'

program
  .option(
    '-b, --broker-url <brokerUrl>',
    'Pact broker URL where the contracts will be published.'
  )
  .parse(process.argv)

const {brokerUrl} = program.opts()
if (!brokerUrl)
  throw new Error(
    'You need to specify the broker URL where the contracts will be published.'
  )
const contractsDir = path.resolve(process.cwd(), 'contract/documents')
const {TRAVIS_BRANCH, GITHUB_REF} = process.env
const branch =
  TRAVIS_BRANCH || GITHUB_REF || exec('git rev-parse --abbrev-ref HEAD')
const consumerVersion = versionFromGitTag({
  tagGlob: ''
})
const options = {
  pactFilesOrDirs: [contractsDir],
  pactBroker: brokerUrl,
  tags: [branch],
  consumerVersion
}

new Publisher(options)
  .publishPacts()
  .then(() => {
    console.log(
      `Pact contract for consumer version ${options.consumerVersion} published!`
    )
    console.log(
      `Head over to ${brokerUrl} and login with to see your published contracts.`
    )
  })
  .catch(e => {
    console.log('Pact contract publishing failed: ', e)
  })
