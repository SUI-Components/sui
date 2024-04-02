import dedent from 'dedent'

import handler from '../../src/rules/structure.js'
import {RuleTester} from '../TestHelpers.js'

RuleTester.create('structure', handler).run({
  valid: handler.FILES_AND_FOLDERS.map(pattern => {
    return {
      [pattern]: [],
      name: `Testing ${pattern}`,
      monitoring: true
    }
  }),
  invalid: handler.FILES_AND_FOLDERS.map(pattern => {
    return {
      missmatch: pattern,
      name: `Failed ${pattern}`,
      report: dedent`
        The file or folder ${pattern} is missing.
        This repository should follow the Golden Path file Structure.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      monitoring: false
    }
  })
})
