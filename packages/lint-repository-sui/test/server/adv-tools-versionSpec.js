import dedent from 'dedent'

import handler from '../../src/rules/adv-tools-version.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

const ADV_TOOLS_ENTRIES = Object.entries(handler.ADV_TOOLS_VERSIONS)

RuleTester.create('adv-tools-version', handler).run({
  valid: [
    {
      'package-lock.json': ADV_TOOLS_ENTRIES.map(([name, spectedVersion]) => {
        return MatchStub.create({parsed: {packages: {[`node_modules/@adv-ui/${name}`]: {version: spectedVersion}}}})
      }),
      name: 'Testing all ADV Tools packages',
      monitoring: true
    }
  ],
  invalid: [
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {}}})],
      name: `ADV logger not installed`,
      report: dedent`
            Your project doesnt have installed logger.
            Please install at least the version ${ADV_TOOLS_ENTRIES[0][1]}.
         `,
      monitoring: false
    },
    {
      'package-lock.json': ADV_TOOLS_ENTRIES.map(([name]) => {
        return MatchStub.create({parsed: {packages: {[`node_modules/@adv-ui/${name}`]: {version: '100'}}}})
      }),
      name: `ADV logger wrong version`,
      report: dedent`
            Please be sure that your repository use the latest logger. Version ${ADV_TOOLS_ENTRIES[0][1]}.
            Your current version is 100.
          `,
      monitoring: false
    },
    {
      missmatch: '',
      report: dedent`
        To calculate the ADV Tool version first we need to have a package-lock.json in the root
      `,
      monitoring: 0
    }
  ]
})
