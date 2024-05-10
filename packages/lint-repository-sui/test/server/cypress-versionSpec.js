import dedent from 'dedent'

import handler from '../../src/rules/cypress-version.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

RuleTester.create('cypress-version', handler).run({
  valid: [
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {'node_modules/cypress': {version: '10.0.0'}}}})],
      name: 'Cypress 10 installed',
      monitoring: '10'
    }
  ],
  invalid: [
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {}}})],
      name: 'Cypress not installed',
      report: dedent`
        Your project doesnt have installed Cypress.
        Please install at least the version 10.
      `,
      monitoring: 0
    },
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {'node_modules/cypress': {version: '17.0.0'}}}})],
      name: 'Cypress wrong version',
      report: dedent`
        Please be sure that your repository use the latest Cypress Version 10.
        Your current version is 17.
      `,
      monitoring: '17'
    },
    {
      missmatch: '',
      report: dedent`
        To calculate the cypress version first we need to have a package-lock.json in the root
      `,
      monitoring: 0
    }
  ]
})
