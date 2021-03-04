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
      ' It is mandatory setup a $GITHUB_TOKEN envVar to execute this command'
    )
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-ssr release')
    console.log('')
  })
  .parse(process.argv)

const {branch = 'master', email, name} = program

const execute = async (cmd, full) => {
  try {
    console.log('--->', cmd)
    const [resp] = await shell(cmd)
    const output = full ? resp : resp.stdout
    console.log(output)
    return output
  } catch (e) {
    const output = full ? e : e.stderr
    console.log(output)
    return e
  }
}
;(async () => {
  const cwd = process.cwd()
  const {GITHUB_TOKEN, GH_TOKEN} = process.env

  const gitHubToken = GITHUB_TOKEN || GH_TOKEN

  if (!gitHubToken) throw new Error('Missing GITHUB_TOKEN environment variable')

  try {
    await execute(`git checkout ${branch}`)
    await execute(`git pull origin ${branch}`)
    const lastCommitHash = await execute('git rev-parse HEAD')
    const hasTag = await execute(`git tag --points-at ${lastCommitHash}`)

    if (hasTag) {
      console.log('We are going to release the current tag:', hasTag)
      return await execute('npm run release')
    }

    const repoURL = await execute('git config --get remote.origin.url')
    const gitURL = GitUrlParse(repoURL).toString('https')
    const authURL = new URL(gitURL)
    authURL.username = gitHubToken

    await execute(`git config --global user.email "${email}"`)
    await execute(`git config --global user.name "${name}"`)
    await execute('git remote rm origin')
    await execute(`git remote add origin ${authURL} > /dev/null 2>&1`)

    await execute(`rm -Rf ${path.join(cwd, 'package-lock.json')}`)

    await execute(
      'npm install --only pro --package-lock-only --prefer-online --package-lock --progress false --loglevel error --no-bin-links --ignore-scripts'
    )
    await execute(
      'npm install --only=dev --package-lock-only --prefer-online --package-lock --progress false --loglevel error --no-bin-links --ignore-scripts'
    )

    await execute('npm version minor --no-git-tag-version')
    const nextVersion = require(path.join(cwd, 'package.json')).version
    await execute(
      `git add ${path.join(cwd, 'package.json')} ${path.join(
        cwd,
        'package-lock.json'
      )}`
    )

    await execute(`git commit -m "release(META): ${nextVersion}"`)
    await execute(`git tag -a "v${nextVersion}" -m "v${nextVersion}"`)
    await execute('git status')
    await execute(`git push --set-upstream --tags origin ${branch}`)
  } catch (err) {
    console.log(err)
  }
})()
