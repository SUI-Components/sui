import dedent from 'dedent'

import handler from '../../src/rules/node-version.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

RuleTester.create('node-version', handler).run({
  valid: [
    {
      '.nvmrc': [MatchStub.create({raw: '20'})],
      name: 'nvmrc Exists and has setup the version 20',
      monitoring: '20'
    }
  ],
  invalid: [
    {
      '.nvmrc': [MatchStub.create({raw: '20'}), MatchStub.create({raw: 17})],
      name: 'Exits more than one nvmrc file',
      report: dedent`
        Your project has more than one .nvmrc file. That can be dangerous.
        Please, use onle ONE in the root of your project.
      `,
      monitoring: 0
    },
    {
      '.nvmrc': [MatchStub.create({raw: '16.1.3'})],
      name: 'nvmrc exists, but has an invalid Node version 🫠',
      report: dedent`
        Your current Node version is 16.
        Please be sure that your repository use the latest Node Version 20.
      `,
      monitoring: 0
    },
    {
      missmatch: '',
      report: dedent`
        Every project have to have a .npmrc file to define the node versión.
      `,
      monitoring: 0
    }
  ]
})
