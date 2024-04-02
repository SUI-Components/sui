const NodeVersion = require('./rules/node-version.js')
const ReactVersion = require('./rules/react-version.js')
const PackageLock = require('./rules/package-lock.js')
const GithubAction = require('./rules/github-action.js')
const TypeScript = require('./rules/typescript.js')
const Structure = require('./rules/structure.js')

// ------------------------------------------------------------------------------
// Plugin Definition
// ------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports = {
  rules: {
    'node-version': NodeVersion,
    'react-version': ReactVersion,
    'package-lock': PackageLock,
    'github-action': GithubAction,
    typescript: TypeScript,
    structure: Structure
  }
}
