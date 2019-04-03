#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const parseDiff = require('what-the-diff').parse
const exec = require('child_process').exec
const execSync = require('child_process').execSync
const json2md = require('json2md')
const fs = require('fs')
const log = console.log
const error = console.error
const exit = process.exit
const date = new Date()
const {
  DEFAULT_SCOPES,
  LOCK_FILE_NAME,
  PACKAGE_FILES,
  MAX_BUFFER,
  version,
  scopes: customScopes = [],
  versionRegExp,
  oldVersionRegExp,
  oldPackageVersionRegExp,
  forbiddenExpressionsInCommitRegExp
} = require('../src/config')
const {
  updateFileVersion,
  getModifiedRepository,
  getRepositoryUrl,
  isMonoRepo,
  hasApiError
} = require('../src/helpers')

let newPackageVersion = version
let modifiedPackages = []
let changelogData = []

const pushModifiedPackage = lines => oldVersionLine => {
  const oldVersionIndex = lines.indexOf(oldVersionLine)
  const newVersionLine = lines[oldVersionIndex + 1]
  const newMajorVersionLine = lines[oldVersionIndex + 3]
  const newMajorVersionLineParts = newMajorVersionLine.match(versionRegExp)
  const newVersionParts = newVersionLine.match(versionRegExp)
  const scopes = [...DEFAULT_SCOPES, ...customScopes].join('|')
  const packageRegExp = new RegExp(`"(${scopes})/(.*)":`)
  const packageParts = lines[oldVersionIndex - 1].match(packageRegExp)
  if (!packageParts) return
  const packageScope = packageParts[1]
  const packageName = packageParts[2]
  const from = oldVersionLine.match(versionRegExp)[1]
  const to = newVersionParts
    ? newVersionParts[1]
    : newMajorVersionLineParts && newMajorVersionLineParts[1]
  if (!to) return

  log(`${packageScope}/${packageName}: ${from} => ${to}`)

  modifiedPackages.push({
    packageScope,
    packageName,
    from,
    to
  })
}

const pushChangelogData = (commits, index) => {
  const {packageScope, packageName, from, to} = modifiedPackages[index]
  const gitUrl = getRepositoryUrl({packageScope, packageName})

  changelogData.push({h4: `${packageName} ${to}`})

  // Maybe there is no GitHub URL for this package or it's
  // invalid so we cannot get its changelog data.
  // So that we print an special message.
  if (typeof commits === 'undefined' || hasApiError(commits)) {
    changelogData.push({
      p: 'There is no changelog data for this package.'
    })

    return
  }

  // Retrieve the commits list.
  let isNewVersionCommit = false
  let isOldVersionCommit = false
  let commitsList = []

  commits.forEach(({commit: {message}, html_url: url}) => {
    isOldVersionCommit = message.includes(from) || !isNewVersionCommit
    isNewVersionCommit = message.includes(to) || !isOldVersionCommit

    if (
      isNewVersionCommit &&
      !message.match(forbiddenExpressionsInCommitRegExp)
    ) {
      commitsList.push(`[${message.trim()}](${url})`)
    }
  })

  // Only write the needed changes from monorepo commits.
  if (isMonoRepo(gitUrl)) {
    commitsList = commitsList.filter(commit => {
      const packageNameRegExp = new RegExp(`((.*)-${packageName})`)

      return commit.match(packageNameRegExp)
    })
  }

  changelogData.push({ul: commitsList})
}

const writeChangelogFile = repositories => {
  repositories.forEach(pushChangelogData)

  // Write changelog file.
  const changelogFile = './CHANGELOG.md'
  let changelogTemplate = json2md(changelogData)
  if (fs.existsSync(changelogFile)) {
    execSync(`git checkout -- ${changelogFile}`)
    const currentChangelogData = fs.readFileSync(changelogFile, 'utf-8')
    if (currentChangelogData.includes(changelogTemplate.trim())) {
      log('Your CHANGELOG.md is already updated.')
      exit()
    }
    changelogTemplate = `${json2md(changelogData)}\n${currentChangelogData}`
  }

  fs.writeFile(changelogFile, changelogTemplate.trim(), 'utf-8', err => {
    if (err) error(err)
    log('Wrote CHANGELOG.md sucessfully.')
  })
}

// Set bin version and parse options.
program
  .version(version)
  .option('-p, --phoenix', 'Run a phoenix before building the changelog.')
  .parse(process.argv)

const {phoenix} = program

if (phoenix) {
  execSync(
    `npx rimraf node_modules && npx rimraf ${LOCK_FILE_NAME} && npm install --prefer-online && npm shrinkwrap`
  )
} else {
  execSync(`npx rimraf ${LOCK_FILE_NAME} && npm shrinkwrap`)
}
// Retrieve modified packages info from npm shrinkwrap.
exec('git diff npm-shrinkwrap.json', {maxBuffer: MAX_BUFFER}, (err, stdout) => {
  if (err) error(err)
  const [diff = {}] = parseDiff(stdout)
  const {hunks} = diff

  if (!hunks) {
    log('There are no changes in your shrinkwrap.')
    exit()
  }

  // Update package versions.
  let oldPackageVersionParts
  hunks.find(({lines}) => {
    return lines.find(line => {
      oldPackageVersionParts = line.match(oldPackageVersionRegExp)
      return oldPackageVersionParts
    })
  })

  if (!oldPackageVersionParts)
    PACKAGE_FILES.forEach(filePath =>
      updateFileVersion({filePath, newPackageVersion})
    )

  changelogData.push({
    h2: `${newPackageVersion} (${date.getDate()}/${date.getMonth() +
      1}/${date.getFullYear()})`
  })

  log('MODIFIED PACKAGES:')
  hunks.forEach(({lines}) => {
    // Get modified packages by filtering lines with git removal syntax from
    // diff.
    const linesWithModifiedPackages = lines.filter(line =>
      line.match(oldVersionRegExp)
    )
    linesWithModifiedPackages.forEach(pushModifiedPackage(lines))
  })

  const modifiedRepositories = modifiedPackages.map(getModifiedRepository)

  Promise.all(modifiedRepositories)
    .then(responses => responses.map(response => response && response.json()))
    .then(responses => {
      Promise.all(responses).then(writeChangelogFile)
    })
    .catch(err => error(err))
})
