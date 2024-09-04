import {RuleTester} from 'eslint'
import dedent from 'string-dedent'

import rule from '../../src/rules/decorator-inline-error.js'

describe('decorator-inline-error', () => {
  const ruleTester = new RuleTester({
    parser: require.resolve('@babel/eslint-parser'),
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      babelOptions: {
        configFile: require.resolve('babel-preset-sui')
      }
    }
  })

  ruleTester.run('decorator-inline-error', rule, {
    valid: [
      {
        code: dedent`
        import { AsyncInlineError } from '@s-ui/decorators';
        class MyClass {
          @SomeOtherDecorator()
          @AsyncInlineError()
          async myMethod() {}
        }
      `
      },
      {
        code: dedent`
        class MyClass {
          myMethod() {}
        }
      `
      }
    ],
    invalid: [
      {
        code: dedent`
        import { AsyncInlineError } from '@s-ui/decorators';
        class MyClass {
          @SomeOtherDecorator()
          @inlineError
          async myMethod() {}
        }
      `,
        output: dedent`
        import { AsyncInlineError } from '@s-ui/decorators';
        class MyClass {
          @SomeOtherDecorator()
          @AsyncInlineError()
          async myMethod() {}
        }
      `,
        errors: [
          {
            messageId: 'replaceInlineErrorWithAsyncInlineError',
            type: 'Decorator'
          }
        ]
      },
      // {
      //   skip: true,
      //   code: dedent`
      //     import { AsyncInlineError } from '@s-ui/decorators';
      //     class MyClass {
      //       @AsyncInlineError()
      //       @SomeOtherDecorator()
      //       async myMethod() {}
      //     }
      //   `,
      //   output: dedent`
      //     import { AsyncInlineError } from '@s-ui/decorators';
      //     class MyClass {
      //       @SomeOtherDecorator()
      //       @AsyncInlineError()
      //       async myMethod() {}
      //     }
      //   `,
      //   errors: [
      //     {
      //       messageId: 'asyncInlineErrorDecoratorIsNotLast',
      //       type: 'Decorator'
      //     }
      //   ]
      // },
      {
        code: dedent`
        class MyClass {
          @inlineError
          @SomeOtherDecorator()
          async myMethod() {}
        }
      `,
        output: dedent`
        import { AsyncInlineError } from '@s-ui/decorators';
        class MyClass {
          @AsyncInlineError()
          @SomeOtherDecorator()
          async myMethod() {}
        }
      `,
        errors: [
          {
            messageId: 'replaceInlineErrorWithAsyncInlineError',
            type: 'Decorator'
          }
        ]
      },
      {
        code: dedent`
        class MyClass {
          @inlineError
          async method1() {}

          @inlineError
          async method2() {}
        }
      `,
        output: dedent`
        import { AsyncInlineError } from '@s-ui/decorators';
        class MyClass {
          @AsyncInlineError()
          async method1() {}

          @AsyncInlineError()
          async method2() {}
        }
      `,
        errors: [
          {
            messageId: 'replaceInlineErrorWithAsyncInlineError',
            type: 'Decorator'
          },
          {
            messageId: 'replaceInlineErrorWithAsyncInlineError',
            type: 'Decorator'
          }
        ]
      }
    ]
  })
})
