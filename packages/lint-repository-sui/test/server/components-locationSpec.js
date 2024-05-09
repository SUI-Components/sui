import dedent from 'string-dedent'

import handler from '../../src/rules/components-location.js'
import {MatchStub, RuleTester} from '../TestHelpers.js'

RuleTester.create('components-location', handler).run({
  valid: [
    {
      'app/src/pages/**/*.(j|t)s(x)?': [
        MatchStub.create({path: 'src/app.js'}), // eslint-disable-line
        MatchStub.create({path: 'src/pages/index.js', raw: ''}), // eslint-disable-line
        MatchStub.create({path: 'src/pages/Landing/index.js'}), // eslint-disable-line
        MatchStub.create({path: 'src/pages/Landing/component/index.js', raw: '<div className="pepe" />'}), // eslint-disable-line
      ],
      name: 'Send percentage',
      monitoring: 1,
      report: dedent`
       Currently, your project has 1 component living outside of your SUI-Studio.
       Try to move all those component to your \`packages/ui/components\` folder.
      `
    },
    {
      'src/**/*.(j|t)s(x)?': [
        MatchStub.create({path: 'src/app.js'}), // eslint-disable-line
        MatchStub.create({path: 'src/pages/index.js', raw: '<p>Hola</p>'}), // eslint-disable-line
        MatchStub.create({path: 'src/pages/Landing/index.js', raw: ''}), // eslint-disable-line
        MatchStub.create({path: 'src/pages/Landing/component/index.js', raw: '<div className="pepe" />'}), // eslint-disable-line
      ],
      name: 'Send percentage',
      monitoring: 2,
      report: dedent`
       Currently, your project has 2 component living outside of your SUI-Studio.
       Try to move all those component to your \`packages/ui/components\` folder.
      `
    },
    {
      'src/**/*.(j|t)s(x)?': [
        MatchStub.create({path: 'src/app.js'}), // eslint-disable-line
        MatchStub.create({path: 'src/pages/index.js', raw: 'const name = "Pepe"'}), // eslint-disable-line
        MatchStub.create({path: 'src/pages/Landing/index.js', raw: ''}), // eslint-disable-line
        MatchStub.create({path: 'src/pages/Landing/component/index.js', raw: '<div className="pepe" />'}), // eslint-disable-line
      ],
      name: 'Send percentage',
      monitoring: 1,
      report: dedent`
       Currently, your project has 1 component living outside of your SUI-Studio.
       Try to move all those component to your \`packages/ui/components\` folder.
      `
    }
  ]
})
