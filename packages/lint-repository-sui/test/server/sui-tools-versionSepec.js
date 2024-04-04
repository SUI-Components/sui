import dedent from 'dedent'

import handler from '../../src/rules/sui-tools-version.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

const SUI_TOOLS_ENTRIES = Object.entries(handler.SUI_TOOLS_VERSIONS)

RuleTester.create('sui-tools-version', handler).run({
  valid: [
    {
      'package-lock.json': SUI_TOOLS_ENTRIES.map(([name, spectedVersion]) => {
        return MatchStub.create({parsed: {packages: {[`node_modules/@s-ui/${name}`]: {version: spectedVersion}}}})
      }),
      name: 'Testing all SUI Tools packages',
      monitoring: true
    }
  ],
  invalid: [
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {}}})],
      name: `SUI Bundler not installed`,
      report: dedent`
            Your project does not have installed bundler.
            Please install at least the version ${SUI_TOOLS_ENTRIES[0][1]}.
            If you are not sure about how do it, please contact with Platform Web.
         `,
      monitoring: false
    },
    {
      'package-lock.json': SUI_TOOLS_ENTRIES.map(([name]) => {
        return MatchStub.create({parsed: {packages: {[`node_modules/@s-ui/${name}`]: {version: '100'}}}})
      }),
      name: `SUI Bundler wrong version`,
      report: dedent`
            Please be sure that your repository use the latest bundler. Version ${SUI_TOOLS_ENTRIES[0][1]}.
            Your current version is 100.
            If you are not sure about how do it, please contact with Platform Web.
          `,
      monitoring: false
    },
    {
      missmatch: '',
      report: dedent`
        To calculate the SUI Tool version first we need to have a package-lock.json in the root
        If you are not sure about how do it, please contact with Platform Web.
      `,
      monitoring: 0
    }
  ]
})
