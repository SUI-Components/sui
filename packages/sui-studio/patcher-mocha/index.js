/* eslint no-extend-native:0 */

import React from 'react'
import SUIContext from '@s-ui/react-context'
import withContext from '../src/components/demo/HoC/withContext'
import {cleanDisplayName} from '../src/components/demo/utilities'

const global = globalThis || window // eslint-disable-line
const __CONTEXTS__ = global.__STUDIO_CONTEXTS__ || {}
const __COMPONENT__ = global.__STUDIO_COMPONENT__
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
    get: function(obj, prop) {
      const originalFn = global[fnName]

      if (!__CONTEXTS__) {
        // eslint-disable-next-line
        console.error(
          'Your demo doesn´t have any context define. Create a context.js file in the demo folder.'
        )
        return function(title, cb) {
          return originalFn(title, cb)
        }
      }

      let context = __CONTEXTS__[prop]
      if (!context) {
        // eslint-disable-next-line
        console.error(
          `Your trying to use the context ${prop} but it is not define in your contexts.js file.
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
      EnhanceComponent.displayName = cleanDisplayName(
        EnhanceComponentWithLegacyContext.displayName
      )

      return function(title, cb) {
        return originalFn(`[${prop}] ${title}`, cb.partial(EnhanceComponent))
      }
    }
  }
  const context = new global.Proxy({}, handler)

  global[fnName].context = context
})
