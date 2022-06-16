#!/usr/bin/env node
import {checkIsPullRequest} from '../src/git.js'
import {release} from '../src/index.js'

const {
  GH_TOKEN, // deprecated
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
