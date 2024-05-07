const NodeVersion = require('./rules/node-version.js')
const ReactVersion = require('./rules/react-version.js')
const CypressVersion = require('./rules/cypress-version.js')
const PackageLock = require('./rules/package-lock.js')
const GithubAction = require('./rules/github-action.js')
const TypeScript = require('./rules/typescript.js')
const Structure = require('./rules/structure.js')
const SuiToolsVersion = require('./rules/sui-tools-version.js')
const ADVToolsVersion = require('./rules/adv-tools-version.js')
const TSvsJS = require('./rules/ts-vs-js-files.js')

// ------------------------------------------------------------------------------
// Plugin Definition
// ------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports = {
  rules: {
    'node-version': NodeVersion,
    'react-version': ReactVersion,
    'cypress-version': CypressVersion,
    'package-lock': PackageLock,
    'github-action': GithubAction,
    typescript: TypeScript,
    structure: Structure,
    'sui-tools-version': SuiToolsVersion,
    'adv-tools-version': ADVToolsVersion,
    'ts-vs-js-files': TSvsJS
  }
}
