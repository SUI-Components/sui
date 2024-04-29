import dedent from 'dedent'

import handler from '../../src/rules/github-action.js'
import {RuleTester} from '../TestHelpers.js'

RuleTester.create('github-action', handler).run({
  valid: [
    {
      '.github/workflows': [],
      name: 'The porject has define a worflows folder',
      monitoring: true
    },
    {
      '.github/**/main.yml': [],
      name: 'The porject has define a worflow for the main branch',
      monitoring: true
    },
    {
      '.github/**/pullrequest.yml': [],
      name: 'The porject has define a worflow for PRs',
      monitoring: true
    }
  ],
  invalid: [
    {
      missmatch: '.github/workflows',
      name: 'The porject has NOT define a worflows folder',
      report: dedent`
        Every project needs to have a .github/worflows folder to be able to run CI/CD in GHA.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      monitoring: false
    },
    {
      missmatch: '.github/**/main.yml',
      name: 'The porject has NOT define a worflow for the main branch',
      report: dedent`
        Every project needs to have a workflow to run on master.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      monitoring: false
    },
    {
      missmatch: '.github/**/pullrequest.yml',
      name: 'The porject has NOT define a worflow for PRs',
      report: dedent`
        Every project needs to have a workflow to run on every PR.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      monitoring: false
    }
  ]
})
