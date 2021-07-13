#!/usr/bin/env node
import {release} from '../src/index'
import {checkIsPullRequest} from '../src/git'

const {
  GH_TOKEN, // deprecated
  GITHUB_EMAIL: gitHubEmail,
  GITHUB_TOKEN,
  GITHUB_USER: gitHubUser
} = process.env

// to keep compatibility with previous environment variable
// GITHUB_TOKEN usage is preferred
const gitHubToken = GITHUB_TOKEN || GH_TOKEN
const isPullRequest = checkIsPullRequest()

release({
  gitHubEmail,
  gitHubToken,
  gitHubUser,
  isPullRequest
})
