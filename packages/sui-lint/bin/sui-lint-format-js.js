#!/usr/bin/env node
/* eslint-disable no-console */
const {
  executeLintingCommand,
  getFilesToLint,
  stageFilesIfRequired,
  isOptionSet,
  GIT_IGNORE_PATH,
  OPTIONS: {staged, addFixes}
} = require('../src/helpers')
const {showError, getSpawnPromise} = require('@s-ui/helpers/cli')

const BIN_PATH = require.resolve('prettier/bin-prettier')
const CONFIG_PATH = require.resolve('../.prettierrc')
const EXTENSIONS = ['js', 'jsx']
const defaultPattern = `**/{src,test}/**/*.{${EXTENSIONS}}`

getFilesToLint(EXTENSIONS, defaultPattern).then(
  files =>
    (files.length &&
      executeLintingCommand(BIN_PATH, [
        `--config ${CONFIG_PATH}`,
        `--no-editorconfig`,
        `--ignore-path ${GIT_IGNORE_PATH}`,
        `--write`,
        files.length === 1 ? files[0] : `"{${files.join(',')}}"`
      ])
        .then(() => stageFilesIfRequired(EXTENSIONS))
        .then(() => {
          const lintArgs = ['js', '--fix']
          isOptionSet(staged) && lintArgs.push(staged)
          isOptionSet(addFixes) && lintArgs.push(addFixes)
          return getSpawnPromise('sui-lint', lintArgs)
        })
        .catch(showError)) ||
    console.log('[sui-lint js-format] No javascript files to format.')
)
