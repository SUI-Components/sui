/* eslint-disable no-nested-ternary */
/* eslint no-extend-native:0 */

import React from 'react'
import SUIContext from '@s-ui/react-context'
import hoistNonReactStatics from 'hoist-non-react-statics'
import withContext from '../components/demo/HoC/withContext'
import {addSetupEnvironment} from '../environment-mocha/setupEnvironment'

const global =
  typeof globalThis !== 'undefined'
    ? globalThis // eslint-disable-line
    : typeof window !== 'undefined'
    ? window
    : undefined

addSetupEnvironment(global)

const functionsToPatch = ['describe']

Function.prototype.partial = function() {
  const fn = this
  const args = Array.prototype.slice.call(arguments)
  return function() {
    let arg = 0
    for (var i = 0; i < args.length && arg < arguments.length; i++)
      if (args[i] === undefined) args[i] = arguments[arg++]
    return fn.apply(this, args)
  }
}

functionsToPatch.forEach(fnName => {
  const handler = {
    get: function(obj /* describe.context */, prop /* context name */) {
      return function(title, cb, displayName) {
        const originalFn = global[fnName]

        const __COMPONENT__ =
          global.__STUDIO_COMPONENT__[displayName] ||
          global.__STUDIO_COMPONENT__

        const __CONTEXTS__ =
          global.__STUDIO_CONTEXTS__[__COMPONENT__.displayName] ||
          global.__STUDIO_CONTEXTS__ ||
          {}

        if (!__CONTEXTS__) {
          console.error(
            `You're trying to use the context ${prop} but it's not defined in your context.js files`
          ) // eslint-disable-line
          return originalFn(title, cb)
        }

        let context = __CONTEXTS__[prop]
        if (!context) {
          // eslint-disable-next-line
          console.error(
            `Your trying to use the context ${prop} but it is not defined in your context.js files.
          Only are allow the following contexts: ${Object.keys(__CONTEXTS__)}.
          as fallback you will use the "default" context in your test`
          )

          context = __CONTEXTS__.default
        }

        const EnhanceComponentWithLegacyContext = withContext(
          context,
          context
        )(__COMPONENT__)
        const EnhanceComponent = props => (
          <SUIContext.Provider value={context}>
            <EnhanceComponentWithLegacyContext {...props} />
          </SUIContext.Provider>
        )
        hoistNonReactStatics(
          EnhanceComponent,
          EnhanceComponentWithLegacyContext
        )

        return originalFn(`[${prop}] ${title}`, cb.partial(EnhanceComponent))
      }
    }
  }
  const context = new global.Proxy({}, handler)

  global[fnName].context = context
})
