/* global __BASE_DIR__ */
import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

import SUIContext from '@s-ui/react-context'
import withContext from '../components/demo/HoC/withContext'
import {cleanDisplayName} from '../components/demo/utilities'
import {importContexts, importReactComponent} from '../components/tryRequire'
import {addSetupEnvironment} from '../environment-mocha/setupEnvironment'

addSetupEnvironment(window)

window.__STUDIO_CONTEXTS__ = {}
window.__STUDIO_COMPONENT__ = {}

const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1)

// Require all the files from a context
const importAll = r => r.keys().forEach(r)

// Avoid running Karma until all components tests are loaded
const originalKarmaLoader = window.__karma__.loaded
window.__karma__.loaded = () => {}

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

  NextComponent.displayName = cleanDisplayName(displayName)

  return NextComponent
}

// get all tests files available using a regex
const allTestsFiles = require.context(
  `${__BASE_DIR__}/test/`,
  true,
  /\.\/(\w+)\/(\w+)\/index.(js|jsx)$/
)
// get all the needed components from the available tests
Promise.all(
  allTestsFiles.keys().map(async key => {
    // get the category component from the segments of the path
    // ex: ./card/property/index.js -> card property
    const [, category, component] = key.split('/')
    const displayName = capitalize(category) + capitalize(component)

    const getContexts = await importContexts({category, component})
    const context =
      typeof getContexts === 'function' ? await getContexts() : getContexts

    const Component = await importReactComponent({
      category,
      component,
      extractDefault: true
    })

    window.__STUDIO_CONTEXTS__[displayName] = context
    window.__STUDIO_COMPONENT__[displayName] = Component
    window[displayName] = enhanceComponent(displayName) // eslint-disable-line
  })
).then(() => {
  // in order to force all tests, we're importing all the files that matches the pattern
  importAll(allTestsFiles)
  // we're ready to go
  originalKarmaLoader.call(window.__karma__)
})
