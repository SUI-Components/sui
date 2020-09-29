/* eslint no-console:0 */
const fs = require('fs-extra')
const path = require('path')
const {getComponentsNames} = require('./helpers/walker')
const {getSpawnPromise} = require('@s-ui/helpers/cli')

const program = require('commander')

const PACKAGE_TEMPLATE = {
  name: 'components',
  version: '0.0.0',
  description: '',
  main: '',
  scripts: {
    test: 'echo "Error: no test specified" && exit 1'
  }
}

program
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-studio install')
    console.log('    $ sui-studio install --help')
    console.log('')
  })
  .parse(process.argv)

const componentsNames = getComponentsNames()

const dependencies = {}
componentsNames.forEach(component => {
  const componentName = component.replace('/', '-')
  dependencies[componentName] = `file:./${component}`
})

fs.writeJSON('./components/package.json', {
  ...PACKAGE_TEMPLATE,
  dependencies
}).then(() => {
  getSpawnPromise(
    'npm',
    ['install', '--no-audit', '--no-package-lock', '--no-optional'],
    {
      cwd: path.join(process.env.PWD, 'components'),
      shell: false
    }
  ).then(process.exit, process.exit)
})
