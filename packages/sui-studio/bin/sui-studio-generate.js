/* eslint no-console:0 */
const fs = require('fs')
const path = require('path')
const {spawn} = require('child_process')

const program = require('commander')
const colors = require('colors')
const toKebabCase = require('just-kebab-case')
const toPascalCase = require('just-pascal-case')

const {showError} = require('@s-ui/helpers/cli')
const {writeFile} = require('@s-ui/helpers/file')

program
  .option('-R, --router', 'add routering for this component')
  .option('-C, --context', 'add context for this component')
  .option('-P, --prefix <prefix>', 'add prefix for this component')
  .option('-S, --scope <scope>', 'add scope for this component')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-studio generate <category> <component>')
    console.log('    $ sui-studio generate cards alfa')
    console.log('    $ sui-studio generate searchs re-beta -P mt')
    console.log('    $ sui-studio generate searchs re-beta -R -C')
    console.log('    $ custom-help --help')
    console.log('    $ custom-help -h')
    console.log('')
  })
  .parse(process.argv)

const BASE_DIR = process.cwd()
const [category, component] = program.args

if (!component) {
  showError('component must be defined')
}
if (!category) {
  showError('category must be defined')
}

const wordsOnlyRegex = /^[\w]+$/

if (!wordsOnlyRegex.test(component)) {
  showError('component name must contain letters or underscore only')
}
if (!wordsOnlyRegex.test(category)) {
  showError('category name must contain letters or underscore only')
}

const componentInPascal = toPascalCase(
  `${category.replace(/s$/, '')} ${component}`
)

const COMPONENT_DIR = `/components/${category}/${component}/`
const COMPONENT_PATH = `${BASE_DIR}${COMPONENT_DIR}`
const COMPONENT_ENTRY_JS_POINT_FILE = `${COMPONENT_PATH}src/index.js`
const COMPONENT_PACKAGE_JSON_FILE = `${COMPONENT_PATH}package.json`
const COMPONENT_PACKAGE_GITIGNORE_FILE = `${COMPONENT_PATH}.gitignore`
const COMPONENT_PACKAGE_NPMIGNORE_FILE = `${COMPONENT_PATH}.npmignore`
const COMPONENT_ENTRY_SCSS_POINT_FILE = `${COMPONENT_PATH}src/index.scss`
const COMPONENT_README_FILE = `${COMPONENT_PATH}README.md`

const DEMO_DIR = `${BASE_DIR}/demo/${category}/${component}/`
const COMPONENT_PLAYGROUND_FILE = `${DEMO_DIR}playground`
const COMPONENT_CONTEXT_FILE = `${DEMO_DIR}context.js`
const COMPONENT_ROUTES_FILE = `${DEMO_DIR}routes.js`

const TEST_DIR = `${BASE_DIR}/test/${category}/${component}/`
const COMPONENT_TEST_FILE = `${TEST_DIR}index.js`

const {context, router, scope, prefix = 'sui'} = program
const packageScope = scope ? `@${scope}/` : ''
const packageCategory = category ? `${toKebabCase(category)}-` : ''
const packageName = `${packageScope}${prefix}-${packageCategory}${toKebabCase(
  component
)}`
const packageInfo = require(path.join(process.cwd(), 'package.json'))
const {repository, homepage} = packageInfo

// Check if the component already exist before continuing
if (fs.existsSync(COMPONENT_PATH)) {
  showError(`[${packageName}] This component already exist in the path:
  ${COMPONENT_PATH}`)
}

if (!repository.url || !homepage) {
  console.log(
    `Missing repository and/or homepage field in monorepo package.json
Component is created without those fields.`.yellow
  )
}

Promise.all([
  writeFile(
    COMPONENT_PACKAGE_GITIGNORE_FILE,
    `lib
node_modules`
  ),

  writeFile(
    COMPONENT_PACKAGE_NPMIGNORE_FILE,
    `src
assets`
  ),

  writeFile(
    COMPONENT_PACKAGE_JSON_FILE,
    `{
  "name": "${packageName}",
  "version": "1.0.0",
  "description": "",
  "main": "lib/index.js",
  "scripts": {
    "prepare": "npx rimraf ./lib && npm run build:js && npm run build:styles",
    "build:js": "../../../node_modules/.bin/babel --presets sui ./src --out-dir ./lib",
    "build:styles": "../../../node_modules/.bin/cpx './src/**/*.scss' ./lib"
  },
  "peerDependencies": {
    "@s-ui/component-dependencies": "1"
  },${
    repository.url
      ? `
  "repository": {
    "type": "${repository.type}",
    "url": "${repository.url}"
  },`
      : ''
  }${
      homepage
        ? `
    "homepage": "${homepage.replace('/master', `/master${COMPONENT_DIR}`)}",`
        : ''
    }
  "keywords": [],
  "author": "",
  "license": "MIT"
}`
  ),

  writeFile(
    COMPONENT_ENTRY_JS_POINT_FILE,
    `// import PropTypes from 'prop-types'

export default function ${componentInPascal}() {
  return (
    <div className="${prefix}-${componentInPascal}">
      <h1>${componentInPascal}</h1>
    </div>
  )
}

${componentInPascal}.displayName = '${componentInPascal}'
${componentInPascal}.propTypes = {}
`
  ),

  writeFile(
    COMPONENT_ENTRY_SCSS_POINT_FILE,
    `@import '~@s-ui/theme/lib/index';

.${prefix}-${componentInPascal} {
  // Do your magic
}
`
  ),

  writeFile(
    COMPONENT_README_FILE,
    `# ${componentInPascal}

> Description

<!-- ![](./assets/preview.png) -->

## Installation

\`\`\`sh
$ npm install ${packageName}
\`\`\`

## Usage

### Basic usage

#### Import package and use the component

\`\`\`js
import ${componentInPascal} from '${packageName}'

return (<${componentInPascal} />)
\`\`\`

#### Import the styles (Sass)

\`\`\`css
@import '~@s-ui/theme/lib/index';
// @import 'your theme';
@import '~${packageName}/lib/index';
\`\`\`


> **Find full description and more examples in the [demo page](#).**`
  ),

  writeFile(COMPONENT_PLAYGROUND_FILE, `return (<${componentInPascal} />)`),

  router &&
    writeFile(
      COMPONENT_ROUTES_FILE,
      `module.exports = {
  pattern: '/:lang',
  'default': '/es',
  'en': '/en',
  'de': '/de'
}`
    ),

  context &&
    writeFile(
      COMPONENT_CONTEXT_FILE,
      `module.exports = {
  'default': {
    i18n: {t (s) { return s.split('').reverse().join('') }}
  }
}`
    ),
  writeFile(
    COMPONENT_TEST_FILE,
    `/*
 * Remember: YOUR COMPONENT IS DEFINED GLOBALLY
 * */

/* eslint react/jsx-no-undef:0 */
/* eslint no-undef:0 */

import ReactDOM from 'react-dom'

import chai, {expect} from 'chai'
import chaiDOM from 'chai-dom'

chai.use(chaiDOM)

describe('${componentInPascal}', () => {
  const Component = ${componentInPascal}
  const setup = setupEnvironment(Component)

  it('should render without crashing', () => {
    // Given
    const props = {}

    // When
    const component = <Component {...props} />

    // Then
    const div = document.createElement('div')
    ReactDOM.render(component, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  it('should NOT render null', () => {
    // Given
    const props = {}

    // When
    const {container} = setup(props)

    // Then
    expect(container.innerHTML).to.be.a('string')
    expect(container.innerHTML).to.not.have.lengthOf(0)
  })

  it('example to be deleted', () => {
    // Example TO BE DELETED!!!!

    // Given
    // const props = {}

    // When
    // const {getByRole} = setup(props)

    // Then
    // expect(getByRole('button')).to.have.text('HOLA')
    expect(true).to.be.eql(false)
  })
})
`
  )
]).then(() => {
  console.log(colors.gray(`[${packageName}]: Installing the dependencies`))
  const install = spawn('npm', ['install'], {cwd: COMPONENT_PATH})

  install.stdout.on('data', data =>
    console.log(colors.gray(`[${packageName}]: ${data.toString()}`))
  )
  install.stderr.on('data', data =>
    console.log(colors.red(`[${packageName}]: ${data.toString()}`))
  )
})
