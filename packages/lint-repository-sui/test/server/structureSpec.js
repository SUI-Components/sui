import dedent from 'dedent'

import handler from '../../src/rules/structure.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

RuleTester.create('structure', handler).run({
  valid: [
    ...handler.FILES_AND_FOLDERS.map(pattern => {
      return {
        [pattern]: [],
        name: `Testing ${pattern}`,
        monitoring: true
      }
    }),
    {
      '.github/dependabot.yml': [
        MatchStub.create({parsed: {updates: [{labels: ['skynet:update:rebase', 'skynet:merge']}]}})
      ],
      name: 'Dependabot automerge enabled',
      monitoring: true
    }
  ],
  invalid: [
    ...handler.FILES_AND_FOLDERS.map(pattern => {
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
    }),
    {
      missmatch: '.github/dependabot.yml',
      name: 'Dependabot file does not exist',
      report: dedent`
        The file or folder .github/dependabot.yml is missing.
        This repository should follow the Golden Path file Structure.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      monitoring: false
    },
    {
      '.github/dependabot.yml': [MatchStub.create({parsed: {updates: [{labels: []}]}})],
      name: 'Dependabot automerge disabled',
      report: dedent`
        The dependabot automerge feature is disabled.
      `,
      monitoring: false
    }
  ]
})
