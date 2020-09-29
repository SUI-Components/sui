/* eslint-disable no-nested-ternary */
/* eslint no-extend-native:0 */
import {addSetupEnvironment} from '../environment-mocha/setupEnvironment'
import {addReactContextToComponent} from '../components/utils'

const FUNCTION_TO_PATCH = 'describe'

const global = // get the correct global object
  typeof globalThis !== 'undefined'
    ? globalThis // eslint-disable-line
    : typeof window !== 'undefined'
    ? window
    : undefined

addSetupEnvironment(global)

class DescribeContext {
  constructor() {
    return new Proxy(this, this)
  }

  get(target /* describe.context */, contextToUse /* context name */) {
    return function(title, cb, componentKey) {
      const originalFn = global[FUNCTION_TO_PATCH]

      const Component =
        global.__STUDIO_COMPONENT__[componentKey] || global.__STUDIO_COMPONENT__

      const {displayName} = Component

      const contextsForComponent =
        global.__STUDIO_CONTEXTS__[componentKey] ||
        global.__STUDIO_CONTEXTS__ ||
        {}

      if (!contextsForComponent) {
        console.error(
          `[${displayName}] Using context ${contextToUse} but no contexts defined in context.js file.`
        )
        return originalFn(title, cb)
      }

      let context = contextsForComponent[contextToUse]
      if (!context) {
        const listOfContexts = Object.keys(contextsForComponent)
        console.error(
          `[${displayName}] Using context ${contextToUse} but it's not defined in context.js file.
          As fallback you will use the "default" context in your test.
          Other contexts available: ${listOfContexts}.`
        )
        // use default context as fallback
        context = contextsForComponent.default
      }

      const NextComponent = addReactContextToComponent(Component, {context})

      return originalFn(`[${contextToUse}] ${title}`, () =>
        cb(NextComponent, {context})
      )
    }
  }
}

global[FUNCTION_TO_PATCH].context = new DescribeContext()
