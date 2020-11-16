#!/usr/bin/env node
const program = require('commander')

const {updateCommitStatus} = require('../src/index')

const {
  GH_TOKEN,
  GITHUB_REPOSITORY,
  GITHUB_RUN_ID,
  GITHUB_SERVER_URL,
  GITHUB_SHA,
  GITHUB_TOKEN,
  SUI_CI_TOPIC: topicFromEnv,
  TRAVIS_BUILD_WEB_URL,
  TRAVIS_COMMIT,
  TRAVIS_PULL_REQUEST_SHA,
  TRAVIS_REPO_SLUG
} = process.env

const buildUrl =
  TRAVIS_BUILD_WEB_URL ||
  `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`

// GH_TOKEN is deprecated but yet used as a fallback for compatibility
const gitHubToken = GITHUB_TOKEN || GH_TOKEN

const repoSlug = GITHUB_REPOSITORY || TRAVIS_REPO_SLUG

program
  .option(
    '-s, --state <stateKey>',
    'State of the commit. Accepted values:"OK", "KO", "RUN"',
    'KO'
  )
  .option(
    '-u, --url <targetUrl>',
    'Url where the details link navigates to',
    buildUrl
  )
  .option(
    '-t, --topic <ciTopic>',
    'Topic telling what is the commit about',
    topicFromEnv
  )
  .parse(process.argv)

const commit = GITHUB_SHA || TRAVIS_PULL_REQUEST_SHA || TRAVIS_COMMIT
const {state: stateKey, topic, url: targetUrl} = program

updateCommitStatus({
  commit,
  gitHubToken,
  stateKey,
  targetUrl,
  topic,
  repoSlug
})
