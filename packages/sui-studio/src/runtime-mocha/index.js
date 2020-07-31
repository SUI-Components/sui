/* global __BASE_DIR__ */
import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

import SUIContext from '@s-ui/react-context'
import withContext from '../components/demo/HoC/withContext'
import {cleanDisplayName} from '../components/demo/utilities'
import {requireFile} from '../components/tryRequire'
import {addSetupEnvironment} from '../environment-mocha/setupEnvironment'

addSetupEnvironment(window)

export const tryRequireContext = ({category, component}) =>
  requireFile({
    defaultValue: false,
    importFile: () =>
      import(`${__BASE_DIR__}/demo/${category}/${component}/context.js`)
  })

export const tryRequireComponent = ({category, component}) =>
  requireFile({
    defaultValue: false,
    importFile: () =>
      import(`${__BASE_DIR__}/components/${category}/${component}/src/index.js`)
  })

const originalKarmaLoader = window.__karma__.loaded
window.__karma__.loaded = () => {}

const regex = /\.\/(?<categoryName>\w+)\/(?<componentName>\w+)\/(src)+\/(index.js|jsx)$/

function declareAll(resolve) {
  const cache = {}
  const capitalize = s => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  resolve.keys().forEach(srcKey => {
    const {
      groups: {categoryName, componentName}
    } = srcKey.match(regex)
    const displayName = capitalize(categoryName) + capitalize(componentName)
    cache[displayName] = {
      displayName,
      categoryName,
      componentName
    }
  })
  return cache
}
function testAll(resolve) {
  resolve.keys().forEach(key => {
    resolve(key)
  })
}

const enhanceComponent = displayName => {
  !displayName && console.error('[sui-Test] Component without displayName') // eslint-disable-line

  const activeContext = window.__STUDIO_CONTEXTS__[displayName]
  const ActiveComponent = window.__STUDIO_COMPONENT__[displayName]

  const EnhanceComponent = withContext(
    activeContext.default,
    activeContext
  )(ActiveComponent)

  const NextComponent = props => (
    <SUIContext.Provider value={activeContext.default}>
      <EnhanceComponent {...props} />
    </SUIContext.Provider>
  )
  hoistNonReactStatics(NextComponent, ActiveComponent)

  const nextDisplayName = cleanDisplayName(displayName)
  NextComponent.displayName = nextDisplayName

  return NextComponent
}

const run = async () => {
  const cache = declareAll(
    require.context(
      `${__BASE_DIR__}/components/`,
      true,
      /\.\/(\w+)\/(\w+)\/(src)+\/index.(js|jsx)$/
    )
  )

  async function asyncForEach(array, callback) {
    const response = []
    for (let index = 0; index < array.length; index++) {
      response[index] = await callback(array[index], index, array)
    }
    return response
  }

  window.__STUDIO_CONTEXTS__ = {}
  window.__STUDIO_COMPONENT__ = {}
  await asyncForEach(Object.keys(cache), async cachedValueKeyName => {
    const {categoryName, componentName, displayName} = cache[cachedValueKeyName]
    let nextEntityContexts = await tryRequireContext({
      category: categoryName,
      component: componentName
    })
    nextEntityContexts =
      typeof nextEntityContexts !== 'function'
        ? nextEntityContexts
        : await nextEntityContexts() // eslint-disable-line
    const nextEntityComponent = await tryRequireComponent({
      category: categoryName,
      component: componentName
    })
    window.__STUDIO_CONTEXTS__[displayName] = nextEntityContexts
    window.__STUDIO_COMPONENT__[displayName] = nextEntityComponent
    window[displayName] = enhanceComponent(displayName) // eslint-disable-line
  })

  testAll(
    require.context(
      `${__BASE_DIR__}/test/`,
      true,
      /\.\/(\w+)\/(\w+)\/index.(js|jsx)$/
    )
  )

  originalKarmaLoader.call(window.__karma__)
}

run()
