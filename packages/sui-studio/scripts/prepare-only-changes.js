#!/usr/bin/env node
/* eslint-disable no-console */

const COMPONENTS_PATH = './components'
const NEW_COMPONENTS_PATH = './tmpComponents'
const DEMO_PATH = './demo'
const NEW_DEMO_PATH = './tmpDemo'
const TEST_PATH = './test'
const NEW_TEST_PATH = './tmpTest'
const {NO_COMPONENTS_MESSAGE} = require('../config')

const log = console.log
const error = console.error
const fs = require('fs-extra')
const path = require('path')
const fetch = require('node-fetch')
const gitUrlParse = require('git-url-parse')

const MAX_GITHUB_API_RESULTS = 100
const PUBLIC_GITHUB_HOST = 'github.com'
const PUBLIC_GITHUB_API_URL_PATTERN =
  'https://api.github.com/repos/:org/:repo/pulls/:pull_request/commits?per_page=:results'
const PRIVATE_GITHUB_API_URL_PATTERN =
  'https://:host/api/v3/repos/:org/:repo/pulls/:pull_request/commits?access_token=:token'

function getComponentsList(commits) {
  const COMMIT_MESSAGE_PATTERN = /\((?<context>[a-zA-Z]+)\/(?<component>[a-zA-Z(-?)]+)\)/
  const list = []

  commits.forEach(commit => {
    const data = commit.match(COMMIT_MESSAGE_PATTERN)
    if (!data) return
    const {context, component} = data.groups
    const componentPath = `${context}/${component}`
    if (!list.includes(componentPath)) list.push(componentPath)
  })

  return list
}

async function cleanComponents(list) {
  list.forEach(async componentPath => {
    const componentsSrc = `${COMPONENTS_PATH}/${componentPath}/`
    const componentsDest = `${NEW_COMPONENTS_PATH}/${componentPath}/`
    const demoSrc = `${DEMO_PATH}/${componentPath}/`
    const demoDest = `${NEW_DEMO_PATH}/${componentPath}/`
    const tmpSrc = `${TEST_PATH}/${componentPath}/`
    const tmpDest = `${NEW_TEST_PATH}/${componentPath}/`

    try {
      await fs.move(componentsSrc, componentsDest)
      await fs.move(demoSrc, demoDest)
      if (fs.existsSync(tmpSrc)) await fs.move(tmpSrc, tmpDest)
    } catch (err) {
      error(err)
    }
  })

  try {
    await fs.move(
      `${COMPONENTS_PATH}/README.md`,
      `${NEW_COMPONENTS_PATH}/README.md`
    )
    await fs.move(`${DEMO_PATH}/package.json`, `${NEW_DEMO_PATH}/package.json`)
    await fs.remove(COMPONENTS_PATH)
    await fs.remove(DEMO_PATH)
    await fs.remove(TEST_PATH)
    fs.renameSync(NEW_COMPONENTS_PATH, COMPONENTS_PATH)
    fs.renameSync(NEW_DEMO_PATH, DEMO_PATH)
    if (fs.existsSync(NEW_TEST_PATH)) fs.renameSync(NEW_TEST_PATH, TEST_PATH)
  } catch (err) {
    error(err)
  }
}

function getRepositoryUrl() {
  const packageJson = require(path.join(process.cwd(), 'package.json'))
  return packageJson.repository && packageJson.repository.url
}

function check(requiredVarName, requiredVar) {
  if (!requiredVar) {
    log(
      `You need to set the ${requiredVarName} variable in order to fetch the pull request commits.`
    )
    process.exit(1)
  }
}

function buildPullCommitsResource() {
  const {GITHUB_TOKEN, GITHUB_PULL_REQUEST} = process.env
  check('GITHUB_TOKEN', GITHUB_TOKEN)
  check('GITHUB_PULL_REQUEST', GITHUB_PULL_REQUEST)
  const gitUrl = getRepositoryUrl()
  check('gitUrl', gitUrl)
  const isPublic = gitUrl.includes(PUBLIC_GITHUB_HOST)
  const apiUrlPattern = isPublic
    ? PUBLIC_GITHUB_API_URL_PATTERN
    : PRIVATE_GITHUB_API_URL_PATTERN
  const {resource, organization, name} = gitUrlParse(gitUrl)

  return apiUrlPattern
    .replace(':host', resource)
    .replace(':org', organization)
    .replace(':repo', name)
    .replace(':pull_request', GITHUB_PULL_REQUEST)
    .replace(':token', GITHUB_TOKEN)
    .replace(':results', MAX_GITHUB_API_RESULTS)
}

const pullCommits = buildPullCommitsResource()

fetch(pullCommits)
  .then(response => response.json())
  .then(response => {
    const commits = response.map(({commit}) => commit.message)
    const componentsList = getComponentsList(commits)

    if (componentsList.length < 1) {
      log(NO_COMPONENTS_MESSAGE)
      process.exit(0)
    }
    cleanComponents(componentsList)
  })
