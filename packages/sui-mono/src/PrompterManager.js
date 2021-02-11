/* eslint-disable no-console */

// Promisify polyfill to add compatibility on node < 8 versions.
const {readFileSync} = require('fs')
const {close, write} = require('fs').promises
const colors = require('@s-ui/helpers/colors')
const {open} = require('temp').track()
const util = require('util')
const editorLegacy = require('editor')
const {exec: execNative} = require('child_process')

const ErrorCommitSaver = require('./ErrorCommitSaver')
const buildCommit = require('./buildCommit')
const config = require('./config')
const {types: commitTypes} = require('./commitTypes')

const exec = util.promisify(execNative)
const editor = util.promisify(editorLegacy)
const openTempFile = util.promisify(open)

const scopes = config.getWorkspaces().map(name => ({name}))

const allowedBreakingChanges = ['feat', 'fix']
const typesWithOtherScopes = ['feat', 'fix', 'release', 'test', 'docs', 'chore']
const defaultScopes = [{name: 'META'}, {name: 'Root'}, {name: 'examples'}]
const otherScopes = defaultScopes

const getCommitTypesMapped = () =>
  Object.keys(commitTypes).map(value => ({
    value,
    name: commitTypes[value].description
  }))

/**
 * Create the prompter manager, is the one that have the responsibility of manage different prompt flows
 * class
 */
class PrompterManager {
  /**
   * Init the edit flow.
   * The edit flow will save our commit on a temporally file, open it on an editor and wait expecting for changes.
   * @return {undefined}
   */
  static async startEditFlow(answers) {
    const {path, fd} = await openTempFile(null)
    await write(fd, buildCommit(answers))
    await close(fd)
    const editorReturnValue = await editor(path)

    if (!editorReturnValue) {
      const commitStr = readFileSync(path, {encoding: 'utf8'})
      this.doCommit(commitStr)
    } else {
      const commitMsg = buildCommit(answers)
      console.log(
        `Editor returned non zero value. Commit message was:\n ${commitMsg}`
      )
    }
  }

  /**
   * Check if modified files are present
   * @param  {[type]}  path Folder to check
   * @return {Promise<Boolean>}
   */
  static async checkIfHasChangedFiles(path) {
    const output = await exec(`git status ${path}`, {cwd: process.cwd()})
    return !output.stdout.includes('nothing to commit')
  }

  /**
   * The doCommit method will init an error listener, start the git commit flow, and if all goes ok discard the old commit if was saved before.
   * @param {string} commitString
   */
  static doCommit(commitString) {
    ErrorCommitSaver.initErrorListener(commitString)
    this.commit(commitString)
    ErrorCommitSaver.discardOldCommit()
  }

  /**
   * The get commmit steps method will return an array of objects that corresponds to the different steps of our commit promptet.
   * [Step1, ...2, ...3, ...4, ...5, ...6, ...7]
   * @returns {Object[]}
   */
  static getCommitSteps() {
    return [
      {
        type: 'list',
        name: 'type',
        message: "Select the type of change that you're committing:",
        choices: getCommitTypesMapped()
      },
      {
        type: 'list',
        name: 'scope',
        message: '\nDenote the SCOPE of this change:',
        choices: answers => {
          return Promise.all(
            scopes.map(pkg =>
              this.checkIfHasChangedFiles(pkg.name).then(
                hasFiles => hasFiles && pkg
              )
            )
          )
            .then(result => result.filter(Boolean))
            .then(result =>
              typesWithOtherScopes.includes(answers.type)
                ? result.concat(otherScopes)
                : result
            )
            .catch(e => console.error(e))
        }
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
        message:
          'Provide a LONGER description of the change (optional). Use "|" to break new line:\n'
      },
      {
        type: 'input',
        name: 'breaking',
        message: 'List any BREAKING CHANGES (optional):\n',
        when: answers =>
          allowedBreakingChanges.indexOf(answers.type.toLowerCase()) > -1
      },
      {
        type: 'input',
        name: 'footer',
        message:
          'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n'
      },
      {
        type: 'expand',
        name: 'confirmCommit',
        choices: [
          {key: 'y', name: 'Yes', value: 'yes'},
          {key: 'n', name: 'Abort commit', value: 'no'},
          {key: 'e', name: 'Edit message', value: 'edit'}
        ],
        message: answers => {
          const SEP =
            '###--------------------------------------------------------###'
          console.log(`${SEP} \n ${buildCommit(answers)} \n ${SEP} \n`)
          return 'Are you sure you want to proceed with the commit above?'
        }
      }
    ]
  }

  static startRecoverOldCommitFlow(cz, commit, commitString) {
    const HR =
      '\n ******************************************************************\n'
    console.log(
      colors.yellow(
        `${HR} ${commitString} ${HR} -> We found that you had problems with the last commit and we saved the message for you 😇.`
      )
    )
    cz.prompt([
      {
        type: 'confirm',
        name: 'foundOldCommit',
        message: '- Would you like to commit with this message?'
      }
    ]).then(answers => {
      if (answers.foundOldCommit) {
        ErrorCommitSaver.initErrorListener(commitString)
        commit(commitString)
        ErrorCommitSaver.discardOldCommit()
      } else {
        ErrorCommitSaver.discardOldCommit()
        PrompterManager.startMainCommitFlow(cz, commit)
      }
    })
  }

  /**
   * initMainCommitFlow is the entry function to init our commit prompter from step 1.
   * @param cz
   * @param commit
   */
  static startMainCommitFlow(cz, commit) {
    this.commit = commit
    console.log(
      '\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n'
    )

    cz.prompt(this.getCommitSteps()).then(answers => {
      if (answers.confirmCommit === 'edit') {
        this.startEditFlow(answers)
      } else if (answers.confirmCommit === 'yes') {
        this.doCommit(buildCommit(answers))
      } else {
        console.log(colors.red('Commit has been canceled.'))
      }
    })
  }
}

module.exports = PrompterManager
