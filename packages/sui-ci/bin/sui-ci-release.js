#!/usr/bin/env node
const {release} = require('../src/index')
const {checkIsPullRequest} = require('../src/git')

const {
  GH_TOKEN,
  GITHUB_EMAIL: gitHubEmail,
  GITHUB_TOKEN,
  GITHUB_USER: gitHubUser
} = process.env

// to keep compatibility with previous environment variable
// GITHUB_TOKEN usage is preferred
const gitHubToken = GITHUB_TOKEN || GH_TOKEN

checkIsPullRequest().then(isPullRequest => {
  release({
    gitHubEmail,
    gitHubToken,
    gitHubUser,
    isPullRequest
  })
})
