#!/usr/bin/env node
/* eslint-disable no-console */

import {createRequire} from 'module'

import {program} from 'commander'
import {$} from 'execa'
import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const PACKAGE_REGEX = /packages\/((([a-z]+)-?)+)/ // matches "packages/sui-any-package-name"
const DEPENDABOT_TAG = 'dependabot'

program
  .name('publish-tagged-packages')
  .description('CLI to publish new tagged versions from modified packages in pull requests.')
  .version('0.0.1')

program
  .option('-t, --tag [tag]', 'Tag used to publish the packages to NPM.')
  .option('-f, --files [files]', 'Comma-separated list of added and modified files.')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log(
      '    $ node ./scripts/publish-tagged-packages.mjs --tag \'ongoing-branch\' --files \'"packages/sui-mono/foo.js","packages/sui-bundler/bar.js"\''
    )
    console.log('')
  })
  .parse(process.argv)

function getConfig(fileName) {
  const require = createRequire(import.meta.url)

  return require(`../${fileName}/package.json`)
}

async function getPackageVersion({name, tag}) {
  let version = ''

  try {
    // Try to get a previously tagged version.
    const {stdout: currentTaggedVersion} = await $`npm view ${name}@${tag} version`
    const [mainVersion, taggedVersion] = currentTaggedVersion.split(`-${tag}.`)

    version = `${mainVersion}-${tag}.${Number(taggedVersion) + 1}`
  } catch (error) {
    // If not, create a new tag from the main package version.
    const {stdout: currentVersion} = await $`npm view ${name} version`
    const [major, minor] = currentVersion.split('.')

    version = `${major}.${Number(minor) + 1}.0-${tag}.0`
  }

  return version
}

async function publishPackages() {
  const {tag, files = ''} = program.opts()

  if (!tag) {
    throw new Error('🤨 Tag is mandatory in order to publish new package versions.')
  }

  // Get needed packages to publish.
  const packagesToPublish = [
    // Avoid duplicates.
    ...new Set(
      files
        .split(',')
        // Filter only packages.
        .filter(file => file.match(PACKAGE_REGEX))
        // Return the package path.
        .map(file => file.match(PACKAGE_REGEX)[0])
    )
  ]

  if (!packagesToPublish.length) {
    console.log('\n🐒 There is no new tags to be published.\n')
    return
  }

  packagesToPublish.forEach(async packageName => {
    const packageConfig = getConfig(packageName)
    const {name} = packageConfig
    const version = await getPackageVersion({name, tag: tag.startsWith(DEPENDABOT_TAG) ? DEPENDABOT_TAG : tag})

    // Set the new tagged version.
    packageConfig.version = version

    const packagePath = path.join(process.cwd(), packageName)
    const packageJsonPath = `${packagePath}/package.json`
    const packageJson = await prettier.format(JSON.stringify(packageConfig), {parser: 'json'})

    // Allow `execa` to execute NPM commands on the cwd of each package.
    const $$ = $({cwd: packagePath})

    console.log(`\n📦 Publishing new tagged version: ${name}@${version}\n`)

    fs.writeFileSync(packageJsonPath, packageJson)

    await $$`npm publish --tag ${tag}`
  })
}

await publishPackages()

program.parse(process.argv)
