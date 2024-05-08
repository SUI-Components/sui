import dedent from 'string-dedent'

import handler from '../../src/rules/sass-files.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

RuleTester.create('sass-files', handler).run({
  valid: [
    {
      '**/*.scss': [MatchStub.create({}), MatchStub.create({}), MatchStub.create({})],
      name: 'Send number of Sass files',
      monitoring: 3,
      report: dedent`
       Currently, your project has 3 sass files.
       We should remove as many sass files as we can
      `
    }
  ]
})
