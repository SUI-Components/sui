/* eslint no-console:0 */
const fetch = require('node-fetch')
const editJsonFile = require('edit-json-file')
const gitUrlParse = require('git-url-parse')
const {
  MAX_GITHUB_API_RESULTS,
  PUBLIC_GITHUB_HOST,
  PUBLIC_GITHUB_API_URL_PATTERN,
  PRIVATE_GITHUB_API_URL_PATTERN,
  INVALID_GITHUB_REPOSITORY_MESSAGE,
  LIMIT_EXCEEDED_GITHUB_REPOSITORY_MESSAGE,
  githubToken,
  monoRepoRegExp
} = require('./config')

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
  let githubApiUrl
  if (isPublic) {
    githubApiUrl = buildPublicGithubApiUrl(gitUrl)
  } else if (githubToken) {
    githubApiUrl = buildPrivateGithubApiUrl({gitUrl, token: githubToken})
  } else {
    return
  }

  return fetch(githubApiUrl)
}

const isMonoRepo = url => url.match(monoRepoRegExp)

const updateFileVersion = ({filePath, newPackageVersion}) => {
  let file = editJsonFile(filePath)
  const version = file.get('version')
  newPackageVersion = version.replace(
    /(\w+).(\w+).(\w+)/,
    (version, major, minor, bugfix) => `${major}.${++minor}.${bugfix}`
  )

  file.set('version', newPackageVersion)
  file.save()
}

const hasApiError = ({message} = {}) =>
  Boolean(
    message &&
      [
        INVALID_GITHUB_REPOSITORY_MESSAGE,
        LIMIT_EXCEEDED_GITHUB_REPOSITORY_MESSAGE
      ].find(errorMessage => message.includes(errorMessage))
  )

module.exports = {
  getRepositoryUrl,
  getModifiedRepository,
  isMonoRepo,
  updateFileVersion,
  hasApiError
}
