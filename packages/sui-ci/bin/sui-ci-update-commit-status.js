#!/usr/bin/env node
const program = require('commander')

const updateCommitStatus = require('../src/index')

const {
  GH_TOKEN: auth,
  SUI_TOPIC: topic,
  TRAVIS_BUILD_WEB_URL: buildUrl,
  TRAVIS_COMMIT,
  TRAVIS_PULL_REQUEST_SHA,
  TRAVIS_REPO_SLUG: repoSlug,
} = process.env

program
  .option('-s, --state <stateKey>', 'State of the commit. Accepted values:"OK", "KO", "RUN"', 'KO')
  .option('-u, --url <targetUrl>', 'Url where the details link navigates to', buildUrl)
  .parse(process.argv)

const commit = TRAVIS_PULL_REQUEST_SHA || TRAVIS_COMMIT
const {state: stateKey, url: targetUrl} = program

updateCommitStatus({
  auth,
  commit,
  stateKey,
  targetUrl,
  topic,
  repoSlug
})
