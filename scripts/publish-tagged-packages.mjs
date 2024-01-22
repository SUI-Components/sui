#!/usr/bin/env node
const program = require('commander')

program
  .name('publish-tagged-packages')
  .description('CLI to publish new tagged versions from modified packages in pull requests.')
  .version('0.0.1')

program
  .option('-t, --tag [tag]', 'Tag used to publish the packages to NPM.')
  .option('-f, --files [files]', 'JSON-stringified list of added and modified files.')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log(
      '    $ node ./scripts/publish-tagged-packages.js --tag ongoing-branch --files ["packages/sui-mono/foo.js", "packages/sui-bundler/bar.js"]'
    )
    console.log('')
  })
  .parse(process.argv)

const {tag, files} = program.opts()

console.log({tag, files: JSON.parse(files)})

program.parse(process.argv)
