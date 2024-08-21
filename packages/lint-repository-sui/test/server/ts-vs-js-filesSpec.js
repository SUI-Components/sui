import dedent from 'string-dedent'

import handler from '../../src/rules/ts-vs-js-files.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

RuleTester.create('ts-vs-js-files', handler).run({
  valid: [
    {
      '**/*.(j|t)s(x)?': [
        MatchStub.create({fullPath: 'file1.js'}),
        MatchStub.create({fullPath: 'file2.js'}),
        MatchStub.create({fullPath: 'file2.ts'})
      ],
      name: 'Send percentage',
      monitoring: 33.33,
      report: dedent`
       Currently, your project has migrated 33.33% of files from JSX? to TSX?.
      `
    },
    {
      '**/*.(j|t)s(x)?': [
        MatchStub.create({fullPath: 'file1.jsx'}),
        MatchStub.create({fullPath: 'file2.js'}),
        MatchStub.create({fullPath: 'file2.tsx'})
      ],
      report: dedent`
       Currently, your project has migrated 33.33% of files from JSX? to TSX?.
      `,
      name: 'Send percentage',
      monitoring: 33.33
    }
  ]
})
