import dedent from 'dedent'

import handler from '../../src/rules/package-lock.js'
import {RuleTester} from '../TestHelpers'

RuleTester.create('package-lock', handler).run({
  valid: [
    {
      'package-lock.json': [],
      name: 'Project has package-lock.json in the root folder',
      monitoring: true
    }
  ],
  invalid: [
    {
      missmatch: '',
      name: 'Project doesnt has package-lock in the root folder',
      report: dedent`
        Every project needs to have a package-lock.json file to be used in CI/CD.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      monitoring: false
    }
  ]
})
