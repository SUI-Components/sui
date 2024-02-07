/* eslint-disable no-console */

const colors = require('@s-ui/helpers/colors')
const {promisify} = require('util')
const exec = promisify(require('child_process').exec)
const {prompt} = require('enquirer')

const buildCommit = require('./build-commit.js')
const config = require('./config.js')
const {types: commitTypes} = require('./commit-types.json')

const scopes = config.getWorkspaces().map(name => ({name}))

const allowedBreakingChanges = ['feat', 'fix']
const defaultScopes = [{name: 'Root'}]

const getCommitTypesMapped = () =>
  Object.keys(commitTypes).map(value => ({
    name: value,
    message: commitTypes[value].description
  }))

const getCommitSteps = ({scopesWithChanges}) => [
  {
    type: 'select',
    name: 'type',
    message: "Type of change that you're committing",
    choices: getCommitTypesMapped()
  },
  {
    type: 'select',
    name: 'scope',
    message: '\nDenote the SCOPE of this change:',
    choices: scopesWithChanges.concat(defaultScopes).filter(scopes => scopes.name !== '.')
  },
  {
    type: 'input',
    name: 'subject',
    message: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    validate: value => !!value,
    filter: value => value.charAt(0).toLowerCase() + value.slice(1)
  },
  {
    type: 'input',
    name: 'body',
    message: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n'
  },
  {
    type: 'input',
    name: 'breaking',
    message: 'List any BREAKING CHANGES (optional):\n',
    skip() {
      const {type} = this.state.answers
      return !allowedBreakingChanges.includes(type)
    }
  },
  {
    type: 'input',
    name: 'footer',
    message: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n'
  },
  {
    type: 'confirm',
    name: 'confirmCommit',
    initial: true,
    message() {
      const {answers} = this.state
      const commitMsg = `\n\n${buildCommit(answers)}\n\n`
      return `${commitMsg}Are you sure you want to proceed with the commit above?`
    }
  }
]

/**
 * Check if modified files are present
 * @param  {[type]}  path Folder to check
 * @return {Promise<Boolean>}
 */
const checkIfHasChangedFiles = async path => {
  const {stdout} = await exec(`git status ${path} --porcelain`, {
    cwd: process.cwd()
  })
  return stdout.trim() !== ''
}

module.exports = async function startMainCommitFlow() {
  const scopesWithChanges = await Promise.all(
    scopes.map(pkg => checkIfHasChangedFiles(pkg.name).then(hasFiles => hasFiles && pkg))
  ).then(result => result.filter(Boolean))

  const answers = await prompt(getCommitSteps({scopesWithChanges})).catch(err => {
    console.error(err)
  })

  if (answers && answers.confirmCommit === true) {
    const commitMsg = buildCommit(answers)
    const commitParams = commitMsg
      .split('\n') // separate each new line to
      .filter(Boolean) // filter empty strings
      .map(msg => `-m "${msg}"`)
      .join(' ')

    const commitArgs = process.argv.slice(2).join(' ')

    await exec(`git commit ${commitParams} ${commitArgs}`, {cwd: process.cwd()})
  } else {
    console.log(colors.red('Commit has been canceled.'))
  }
}
