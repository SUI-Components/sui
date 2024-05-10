import dedent from 'dedent'
import {RuleTester} from 'eslint'
import sinon from 'sinon'

import rule from '../../src/rules/layers-architecture.js'
import {Monorepo} from '../../src/utils/monorepo.js'

const resolvedBabelPresetSui = require.resolve('babel-preset-sui')
const parser = require.resolve('@babel/eslint-parser')

const CWD = '/Users/carlosvillu/Developer/frontend-mt--web-app'

const ruleTester = new RuleTester({parser, parserOptions: {babelOptions: {configFile: resolvedBabelPresetSui}}})
describe('layersArch valid', function () {
  beforeEach(function () {
    this.getterPackagesStub = sinon.stub(Monorepo.prototype, 'packages').get(() => ['domain/package.json'])
    this.getterRootStub = sinon.stub(Monorepo.prototype, 'root').get(() => CWD)
  })
  afterEach(function () {
    this.getterPackagesStub.restore()
    this.getterRootStub.restore()
  })

  ruleTester.run('layersArch', rule, {
    valid: [
      {
        filename: CWD + '/components/animation/fadeOut/demo/context.js',
        code: dedent`
        import DomainBuilder from 'studio-utils/DomainBuilder'

        class User {
          static create() { return new User() }
        }
      `
      },
      {
        filename: CWD + '/components/animation/fadeOut/demo/context.js',
        code: dedent`
        import { createRequire } from "module"

        class User {
          static create() { return new User() }
        }
      `
      }
    ],
    invalid: [
      {
        filename: CWD + '/components/animation/fadeOut/demo/context.js',
        code: dedent`
        import {Coches as Domain} from '../../../../domain/lib/index.js'

        class Model {
          constructor() { this.name = 'John Doe' }
        }
      `,
        errors: [
          {
            message: dedent`
              When using a package from your monorepo, import it directly instead of using a relative path.
            `
          }
        ]
      }
    ]
  })
})
