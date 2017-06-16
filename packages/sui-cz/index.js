/* eslint-disable no-console */

const fs = require('fs')
const editor = require('editor')
const temp = require('temp').track()
const buildCommit = require('./buildCommit')
const config = require('./config')

const scopes = config.getScopes().sort().map(name => ({name}))

function getTypes () {
  var types = require('./types').types
  return Object.keys(types).map(function (value) {
    return { value, name: types[value].description }
  })
}
const types = getTypes()

// This types will also have otherScopes added to them
const typesWithOtherScopes = ['feat', 'fix', 'release', 'test']
const otherScopes = [
  {name: 'META'},
  {name: 'examples'}
]

const allowBreakingChanges = ['feat', 'fix']

module.exports = {
  prompter: function (cz, commit) {
    console.log('\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n')

    cz.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select the type of change that you\'re committing:',
        choices: types
      },
      {
        type: 'list',
        name: 'scope',
        message: '\nDenote the SCOPE of this change:',
        choices: function (answers) {
          if (answers.type === 'chore') {
            return [{name: 'META'}]
          }

          if (typesWithOtherScopes.indexOf(answers.type) > -1) {
            return scopes.concat(otherScopes)
          }

          return scopes
        }
      },
      {
        type: 'input',
        name: 'subject',
        message: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
        validate: function (value) {
          return !!value
        },
        filter: function (value) {
          return value.charAt(0).toLowerCase() + value.slice(1)
        }
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
        when: function (answers) {
          return allowBreakingChanges.indexOf(answers.type.toLowerCase()) > -1
        }
      },
      {
        type: 'input',
        name: 'footer',
        message: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n'
      },
      {
        type: 'expand',
        name: 'confirmCommit',
        choices: [
          { key: 'y', name: 'Yes', value: 'yes' },
          { key: 'n', name: 'Abort commit', value: 'no' },
          { key: 'e', name: 'Edit message', value: 'edit' }
        ],
        message: function (answers) {
          var SEP = '###--------------------------------------------------------###'
          console.log('\n' + SEP + '\n' + buildCommit(answers) + '\n' + SEP + '\n')
          return 'Are you sure you want to proceed with the commit above?'
        }
      }
    ])
    .then(function (answers) {
      if (answers.confirmCommit === 'edit') {
        temp.open(null, function (err, info) {
          if (err) { return }

          fs.write(info.fd, buildCommit(answers))
          fs.close(info.fd, function () {
            editor(info.path, function (code, sig) {
              if (code === 0) {
                var commitStr = fs.readFileSync(info.path, { encoding: 'utf8' })
                commit(commitStr)
              } else {
                console.log('Editor returned non zero value. Commit message was:\n' + buildCommit(answers))
              }
            })
          })
        })
      } else if (answers.confirmCommit === 'yes') {
        commit(buildCommit(answers))
      } else {
        console.log('Commit has been canceled.')
      }
    })
  }
}
