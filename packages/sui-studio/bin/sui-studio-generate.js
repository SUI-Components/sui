// @ts-check
/* eslint no-console:0 */
const fs = require('fs')
const path = require('path')
const {spawn} = require('child_process')

const program = require('commander')
const toKebabCase = require('just-kebab-case')
const toPascalCase = require('just-pascal-case')

const colors = require('@s-ui/helpers/colors.js')
const {showError} = require('@s-ui/helpers/cli.js')
const {writeFile} = require('@s-ui/helpers/file.js')

program
  .option('-C, --context [customContextPath]', 'add context for this component')
  .option('-P, --prefix <prefix>', 'add prefix for this component')
  .option('-S, --scope <scope>', 'add scope for this component')
  .option('-W, --swc', 'Use the new SWC compiler', false)
  .option('-J, --jest', 'Generate jest tests', false)
  .option('-D, --component-dir', 'Path where the component will be generated')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-studio generate <category> <component>')
    console.log('    $ sui-studio generate cards alfa')
    console.log('    $ sui-studio generate searchs re-beta --prefix mt')
    console.log('    $ sui-studio generate searchs re-beta --context')
    console.log('    $ sui-studio --help')
    console.log('    $ sui-studio -h')
    console.log('')
  })
  .parse(process.argv)

const BASE_DIR = process.cwd()
const [category, component] = program.args
const {context, componentDir, scope, prefix = 'sui', swc, jest} = program.opts()

if (!component) showError('component must be defined')
if (!category) showError('category must be defined')

const wordsOnlyRegex = /^[\w]+$/

if (!wordsOnlyRegex.test(component)) {
  showError('component name must contain letters or underscore only')
}
if (!wordsOnlyRegex.test(category)) {
  showError('category name must contain letters or underscore only')
}

const componentInPascal = toPascalCase(`${category.replace(/s$/, '')} ${component}`)

const COMPONENT_DIR = `${componentDir}/${category}/${component}/`
const COMPONENT_PATH = `${BASE_DIR}${COMPONENT_DIR}`
const COMPONENT_ENTRY_JS_POINT_FILE = `${COMPONENT_PATH}src/index.js`
const COMPONENT_PACKAGE_JSON_FILE = `${COMPONENT_PATH}package.json`
const COMPONENT_PACKAGE_GITIGNORE_FILE = `${COMPONENT_PATH}.gitignore`
const COMPONENT_PACKAGE_NPMIGNORE_FILE = `${COMPONENT_PATH}.npmignore`
const COMPONENT_ENTRY_SCSS_POINT_FILE = `${COMPONENT_PATH}src/index.scss`
const COMPONENT_README_FILE = `${COMPONENT_PATH}README.md`

const DEMO_DIR = `${COMPONENT_PATH}/demo/`
const DEMO_PACKAGE_JSON_FILE = `${DEMO_DIR}package.json`
const COMPONENT_PLAYGROUND_FILE = `${DEMO_DIR}index.js`
const COMPONENT_CONTEXT_FILE = `${DEMO_DIR}context.js`

const TEST_DIR = jest ? `${COMPONENT_PATH}/__tests__/` : `${COMPONENT_PATH}/test/`
const COMPONENT_TEST_FILE = `${TEST_DIR}index.test.js`

const packageScope = scope ? `@${scope}/` : ''
const packageCategory = category ? `${toKebabCase(category)}-` : ''
const packageName = `${packageScope}${prefix}-${packageCategory}${toKebabCase(component)}`
const packageInfo = require(path.join(process.cwd(), 'package.json'))
const {repository = {}, homepage} = packageInfo

const removeRepeatedNewLines = str => str.replace(/(\r\n|\r|\n){2,}/g, '$1\n')

const testTemplate = `/*
 * Remember: YOUR COMPONENT IS DEFINED GLOBALLY
 * */

/* eslint react/jsx-no-undef:0 */
/* eslint no-undef:0 */

import ReactDOM from 'react-dom'

import chai, {expect} from 'chai'
import chaiDOM from 'chai-dom'
${context ? '' : "import Component from '../src/index.js'"}

${context ? "import '@s-ui/studio/src/patcher-mocha'" : ''}

chai.use(chaiDOM)

describe${context ? '.context.default' : ''}('${componentInPascal}', ${context ? 'Component' : '()'} => {
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

  it.skip('should NOT extend classNames', () => {
    // Given
    const props = {className: 'extended-classNames'}
    const findSentence = str => string => string.match(new RegExp(\`S*\${str}S*\`))

    // When
    const {container} = setup(props)
    const findClassName = findSentence(props.className)

    // Then
    expect(findClassName(container.innerHTML)).to.be.null
  })
})
`

const testJestTemplate = `
import {render, screen} from 'test/utils/render/index.js'
import Component from '../src/index.js'

describe('${componentInPascal}', () => {
  it('should render a h1', async () => {
    const props = {}

    render(<Component {...props} />)

    const title = await screen.findByRole('heading', {name: '${componentInPascal}', level: 1})
    expect(title).toBeInTheDocument()
  })
})
`

const defaultContext = `module.exports = {
  default: {
    i18n: {
      t(s) {
        return s
          .split('')
          .reverse()
          .join('')
      }
    }
  }
}
`

const buildJs = swc ? 'sui-js-compiler' : 'babel --presets sui ./src --out-dir ./lib'

// Check if the component already exist before continuing
if (fs.existsSync(COMPONENT_PATH)) {
  showError(`[${packageName}] This component already exist in the path:
  ${COMPONENT_PATH}`)
}

Promise.all([
  writeFile(
    COMPONENT_PACKAGE_GITIGNORE_FILE,
    `lib
node_modules`
  ),

  writeFile(
    COMPONENT_PACKAGE_NPMIGNORE_FILE,
    `assets
demo
src
test
__tests__
`
  ),

  writeFile(
    DEMO_PACKAGE_JSON_FILE,
    `{
  "name": "${packageName}-demo",
  "version": "1.0.0",
  "private": true,
  "description": "Demo for ${packageName}"
}`
  ),

  writeFile(
    COMPONENT_PACKAGE_JSON_FILE,
    `{
  "name": "${packageName}",
  "version": "1.0.0",
  "description": "",
  "main": "lib/index.js",
  "scripts": {
    "prepublishOnly": "rimraf lib && npm run build:js && npm run build:styles",
    "build:js": "${buildJs}",
    "build:styles": "cpx './src/**/*.scss' ./lib"
  },
  "peerDependencies": {
    "@s-ui/theme": "8"
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
/* @import 'your theme'; */
@import '~${packageName}/lib/index';
\`\`\`


> **Find full description and more examples in the [demo page](#).**`
  ),

  writeFile(
    COMPONENT_PLAYGROUND_FILE,
    `import ${componentInPascal} from 'packages/components/${category}/${component}/src'
export default () => <${componentInPascal} />
`
  ),

  context &&
    (function () {
      const isBooleanContext = typeof context === 'boolean'

      writeFile(
        COMPONENT_CONTEXT_FILE,
        isBooleanContext ? defaultContext : fs.readFileSync(`${BASE_DIR}${context}`).toString()
      )
    })(),
  writeFile(COMPONENT_TEST_FILE, removeRepeatedNewLines(jest ? testJestTemplate : testTemplate))
]).then(() => {
  console.log(colors.gray(`[${packageName}]: Installing the dependencies`))
  const install = spawn('npm', ['install', '--legacy-peer-deps', '--no-audit', '--no-fund', '--production=false'])

  install.stdout.on('data', data => console.log(colors.gray(`[${packageName}]: ${data.toString()}`)))
  install.stderr.on('data', data => console.log(colors.red(`[${packageName}]: ${data.toString()}`)))
})
