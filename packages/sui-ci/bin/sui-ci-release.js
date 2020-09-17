#!/usr/bin/env node
const program = require('commander')

const {release} = require('../src/index')

const {
  GH_TOKEN,
  GITHUB_EMAIL: gitHubEmail,
  GITHUB_TOKEN,
  GITHUB_USER: gitHubUser,
  TRAVIS_PULL_REQUEST: pullRequestNumber
} = process.env

// to keep compatibility with previous environment variable
// GITHUB_TOKEN usage is preferred
const gitHubToken = GITHUB_TOKEN || GH_TOKEN

program.parse(process.argv)

release({
  gitHubEmail,
  gitHubToken,
  gitHubUser,
  pullRequestNumber
})
