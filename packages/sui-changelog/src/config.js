const path = require('path')
const basePath = process.cwd()
const packageJson = require(path.join(basePath, 'package.json'))
const version = packageJson.version
const {scopes} =
  (packageJson.config && packageJson.config['sui-changelog']) || {}

const DEFAULT_SCOPES = ['@s-ui']
const MAX_GITHUB_API_RESULTS = 100
const PUBLIC_GITHUB_HOST = 'github.com'
const PUBLIC_GITHUB_API_URL_PATTERN =
  'https://api.github.com/repos/:org/:repo/commits?per_page=:results'
const PRIVATE_GITHUB_API_URL_PATTERN =
  'https://:host/api/v3/repos/:org/:repo/commits?access_token=:token'
const PACKAGE_FILES = ['./package.json']
const MAX_BUFFER = 1024 * 1024
const INVALID_GITHUB_REPOSITORY_MESSAGE = 'Not Found'
const LIMIT_EXCEEDED_GITHUB_REPOSITORY_MESSAGE = 'API rate limit exceeded'
const BAD_CREDENTIALS = 'Bad credentials'

const monoRepoRegExp = /(sui|components).git/
const versionRegExp = /"version": "(.*)",/
const oldVersionRegExp = /-\s+"version": "(.*)",/
const oldPackageVersionRegExp = /-\s\s"version": "(.*)",/
const forbiddenExpressionsInCommitRegExp = /^Merge pull request|^Merge branch 'master'|^(feat\(META\): )?(R|r)elease|^Bumping to version/

module.exports = {
  DEFAULT_SCOPES,
  MAX_GITHUB_API_RESULTS,
  PUBLIC_GITHUB_HOST,
  PUBLIC_GITHUB_API_URL_PATTERN,
  PRIVATE_GITHUB_API_URL_PATTERN,
  PACKAGE_FILES,
  MAX_BUFFER,
  INVALID_GITHUB_REPOSITORY_MESSAGE,
  LIMIT_EXCEEDED_GITHUB_REPOSITORY_MESSAGE,
  BAD_CREDENTIALS,
  version,
  scopes,
  monoRepoRegExp,
  versionRegExp,
  oldVersionRegExp,
  oldPackageVersionRegExp,
  forbiddenExpressionsInCommitRegExp
}
