#!/usr/bin/env node
/* eslint no-console:0 no-unused-vars:0 */
const program = require('commander')
const {shell} = require('@tunnckocore/execa')
const GitUrlParse = require('git-url-parse')
const path = require('path')

program
  .option('-B, --branch <branch>', 'Release branch. Will be master by default')
  .option('-E, --email <email>', 'Releaser´s email')
  .option('-N, --name <name>', 'Releaser´s name')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log(
      ' Release a server version. Create a git tag and update a minor version in the package.json'
    )
    console.log(
      ' It is mandatory setup a $GH_TOKEN envVar to execute this command'
    )
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-ssr release')
    console.log('')
  })
  .parse(process.argv)

const {branch = 'master', email, name} = program
;(async () => {
  const cwd = process.cwd()
  const {GH_TOKEN} = process.env

  if (!GH_TOKEN) {
    throw new Error('Missing GH_TOKEN var')
  }

  try {
    const [{stdout: repoURL}] = await shell(
      'git config --get remote.origin.url'
    )
    const gitURL = GitUrlParse(repoURL).toString('https')
    const authURL = new URL(gitURL)
    authURL.username = GH_TOKEN

    // const output = await shell(
    //   [
    //     `git remote add origin-release ${authURL.href}`,
    //     `git config --global user.email "${email}"`,
    //     `git config --global user.name "${name}"`,
    //     `git checkout -b ${branch}`,
    //     `rm ${path.join(cwd, 'package-lock.json')}`,
    //     `git pull origin ${branch} || true`,
    //     `sed -i '/package-lock.json/d' ${path.join(cwd, '.gitignore')}`,
    //     'npm install --package-lock-only',
    //     'npm version minor -m "release(META):v%s"',
    //     `git push --force --quiet --set-upstream --tags origin-release ${branch}`
    //   ],
    //   {cwd}
    // )
    // console.log(output)
  } catch (err) {
    console.log(err)
  }
})()
