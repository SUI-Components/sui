import dedent from 'string-dedent'

import handler from '../../src/rules/spark-adoption.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

RuleTester.create('spark-adoption', handler).run({
  valid: [
    {
      '**/*.(j|t)s(x)?': [
        MatchStub.create({raw: `from * import '@s-ui/react-atom-button'`}) // eslint-disable-line
      ],
      name: 'Send percentage',
      monitoring: 0,
      report: dedent`
        Currently, your project utilizes 0% of Spark UI components out of all SUI and Spark UI components in your project. We should aim to remove as many SUI components as possible.
      `
    },
    {
      '**/*.(j|t)s(x)?': [
        MatchStub.create({raw: `from * import '@s-ui/react-atom-button'`}), // eslint-disable-line
        MatchStub.create({raw: `from * import '@spark-ui/button'`}) // eslint-disable-line
      ],
      name: 'Send percentage',
      monitoring: 50,
      report: dedent`
        Currently, your project utilizes 50% of Spark UI components out of all SUI and Spark UI components in your project. We should aim to remove as many SUI components as possible.
      `
    },
    {
      '**/*.(j|t)s(x)?': [
        MatchStub.create({raw: `from * import '@s-ui/react-atom-button'`}), // eslint-disable-line
        MatchStub.create({raw: `from * import '@s-ui/react-head'`}), // eslint-disable-line
        MatchStub.create({raw: `from * import '@spark-ui/button'`}) // eslint-disable-line
      ],
      name: 'Send percentage',
      monitoring: 50,
      report: dedent`
        Currently, your project utilizes 50% of Spark UI components out of all SUI and Spark UI components in your project. We should aim to remove as many SUI components as possible.
      `
    },
    {
      '**/*.(j|t)s(x)?': [
        MatchStub.create({raw: `from * import '@spark-ui/button'`}) // eslint-disable-line
      ],
      name: 'Send percentage',
      monitoring: 100,
      report: dedent`
        Currently, your project utilizes 100% of Spark UI components out of all SUI and Spark UI components in your project. We should aim to remove as many SUI components as possible.
      `
    }
  ]
})
