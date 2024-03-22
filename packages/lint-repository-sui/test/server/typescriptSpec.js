import dedent from 'dedent'

import handler from '../../src/rules/typescript.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

RuleTester.create('typescript', handler).run({
  valid: [
    {
      'tsconfig.json': [],
      name: 'File `tsconfig.json` exists',
      monitoring: true
    },
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {'node_modules/typescript': {version: '5.0.4'}}}})],
      name: 'TypeScript version is correct',
      monitoring: true
    }
  ],
  invalid: [
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {'node_modules/typescript': {version: '4.2.0'}}}})],
      name: 'TypeScript version is not correct',
      report: dedent`
      Please be sure that your repository use the latest TypeScript version 5.
      Your current version is 4.
      If you are not sure about it, please contact Web Platform.
    `,
      monitoring: false
    },
    {
      'package-lock.json': [MatchStub.create({parsed: {packages: {}}})],
      name: 'TypeScript dependency is not installed',
      report: dedent`
        Your project doesn't have installed TypeScript.
        Please install at least the version 5.
        If you are not sure about it, please contact Web Platform.
    `,
      monitoring: false
    },
    {
      missmatch: '',
      report: dedent`
        Every project must have a \`tsconfig.json\` file to setup TypeScript in the project.
        If you are not sure about how do it, please contact with Web Platform team.
      `,
      monitoring: false
    }
  ]
})
