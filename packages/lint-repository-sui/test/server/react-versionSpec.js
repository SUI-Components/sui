import dedent from 'dedent'

import handler from '../../src/rules/react-version.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

RuleTester.create('react-version', handler).run({
  valid: [
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {'node_modules/react': {version: '18.0.0'}}}})],
      name: 'React 18 installed',
      monitoring: '18'
    }
  ],
  invalid: [
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {}}})],
      name: 'React not installed',
      report: dedent`
        Your project doesnt have installed React.
        Please install at least the version 18.
      `,
      monitoring: 0
    },
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {'node_modules/react': {version: '17.0.0'}}}})],
      name: 'React wrong version',
      report: dedent`
        Please be sure that your repository use the latest React Version 18.
        Your current version is 17.
      `,
      monitoring: '17'
    },
    {
      missmatch: '',
      report: dedent`
        To calculate the react version first we need to have a package-lock.json in the root
      `,
      monitoring: 0
    }
  ]
})
