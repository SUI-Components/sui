/* eslint no-console:0 */
import fetch from 'node-fetch'
import editJsonFile from 'edit-json-file'
import gitUrlParse from 'git-url-parse'
import config from './config.js'

const warn = console.warn

const {
  BAD_CREDENTIALS,
  INVALID_GITHUB_REPOSITORY_MESSAGE,
  LIMIT_EXCEEDED_GITHUB_REPOSITORY_MESSAGE,
  MAX_GITHUB_API_RESULTS,
  monoRepoRegExp,
  PRIVATE_GITHUB_API_URL_PATTERN,
  PUBLIC_GITHUB_API_URL_PATTERN,
  PUBLIC_GITHUB_HOST
} = config

const buildPublicGithubApiUrl = gitUrl => {
  const {organization, name} = gitUrlParse(gitUrl)

  return PUBLIC_GITHUB_API_URL_PATTERN.replace(':org', organization)
    .replace(':repo', name)
    .replace(':results', MAX_GITHUB_API_RESULTS)
}

const buildPrivateGithubApiUrl = ({gitUrl, token}) => {
  const {resource, organization, name} = gitUrlParse(gitUrl)

  return PRIVATE_GITHUB_API_URL_PATTERN.replace(':host', resource)
    .replace(':org', organization)
    .replace(':repo', name)
    .replace(':token', token)
}

const getRepositoryUrl = ({packageScope, packageName}) => {
  const path = require('path')
  const basePath = process.cwd()
  const packageJson = require(path.join(
    basePath,
    'node_modules',
    packageScope,
    packageName,
    'package.json'
  ))

  return packageJson.repository && packageJson.repository.url
}

const getModifiedRepository = ({packageScope, packageName}) => {
  const gitUrl = getRepositoryUrl({packageScope, packageName})
  if (!gitUrl) return
  const isPublic = gitUrl.includes(PUBLIC_GITHUB_HOST)
  const {GITHUB_TOKEN} = process.env
  let githubApiUrl
  if (isPublic) {
    githubApiUrl = buildPublicGithubApiUrl(gitUrl)
  } else if (GITHUB_TOKEN) {
    githubApiUrl = buildPrivateGithubApiUrl({gitUrl, token: GITHUB_TOKEN})
  } else {
    warn(
      'You should set the environment variable `GITHUB_TOKEN` if you want to get the data from a private repository.'
    )
    return
  }

  return fetch(githubApiUrl)
}

const isMonoRepo = url => url.match(monoRepoRegExp)

const updateAndGetFileVersion = filePath => {
  const file = editJsonFile(filePath)
  const version = file.get('version')
  const newPackageVersion = version.replace(
    /(\w+).(\w+).(\w+)/,
    (version, major, minor, bugfix) => `${major}.${++minor}.${bugfix}`
  )

  file.set('version', newPackageVersion)
  file.save()

  return newPackageVersion
}

const hasApiError = ({message} = {}) =>
  Boolean(
    message &&
      [
        INVALID_GITHUB_REPOSITORY_MESSAGE,
        LIMIT_EXCEEDED_GITHUB_REPOSITORY_MESSAGE,
        BAD_CREDENTIALS
      ].find(errorMessage => message.includes(errorMessage))
  )

export default {
  getRepositoryUrl,
  getModifiedRepository,
  isMonoRepo,
  updateAndGetFileVersion,
  hasApiError
}
