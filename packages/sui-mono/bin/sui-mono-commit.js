/* eslint no-console:0 */
const {promisify} = require('util')
const exec = promisify(require('child_process').exec)
const {Command} = require('commander')

const startMainCommitFlow = require('../src/prompter-manager.js')
const {executeCommit} = startMainCommitFlow

const program = new Command()
program
  .option('--no-interactive', 'Skip interactive prompts, requires --type, --scope, --subject')
  .option('-t, --type <type>', 'Commit type (feat, fix, docs, refactor, perf, test, chore, release)')
  .option('-s, --scope <scope>', 'Commit scope (package name or Root)')
  .option('-m, --subject <subject>', 'Commit subject (short description)')
  .option('-b, --body <body>', 'Commit body (optional, use | for newlines)')
  .option('--breaking <breaking>', 'Breaking changes description (optional)')
  .option('--footer <footer>', 'Issues closed (optional, e.g. #31, #34)')
  .allowUnknownOption()
  .parse(process.argv)

const opts = program.opts()

/**
 * Get the list of modified files by the user
 * @param {object}  params
 * @param {boolean} params.checkIfStaged Determine if we should change if the modified file is staged
 */
const getDiffedFiles = ({checkIfStaged = false} = {}) => {
  let command = 'git diff --name-only'
  if (checkIfStaged) command += ' --cached'

  return exec(command).then(({stdout: files = ''}) => ({
    hasFiles: files.trim().length > 0,
    files
  }))
}

/**
 * Start the commiting process, doing some verifications to avoid further problems
 */
async function initCommit() {
  const {hasFiles: hasStagedFiles} = await getDiffedFiles({checkIfStaged: true})

  if (hasStagedFiles === false) {
    console.log('No files added to staging! Did you forget to run git add?\n')
    const modified = await getDiffedFiles()
    if (modified.hasFiles) {
      console.log('Showing the files that you could add:')
      console.log(modified.files)
    }
    return
  }

  if (opts.interactive === false) {
    const {type, scope, subject, body, breaking, footer} = opts
    if (!type || !scope || !subject) {
      console.error('Error: --type, --scope, and --subject are required in non-interactive mode')
      process.exit(1)
    }
    const extraArgs = program.args.join(' ')
    await executeCommit({type, scope, subject, body, breaking, footer}, extraArgs)
    return
  }

  startMainCommitFlow()
}

initCommit()
