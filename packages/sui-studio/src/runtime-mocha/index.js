/* global __BASE_DIR__, CATEGORIES, PATTERN */
/* eslint-disable no-console */

/**
 * This file is being executed in browser opened to run tests
 */
import micromatch from 'micromatch'

import {importContexts, importReactComponent} from '../components/tryRequire.js'
import {addReactContextToComponent} from '../components/utils.js'
import {addSetupEnvironment} from '../environment-mocha/setupEnvironment.js'
addSetupEnvironment(window)

window.__STUDIO_CONTEXTS__ = {}
window.__STUDIO_COMPONENT__ = {}

const defaultPattern = '**/*.test.{js,jsx,ts,tsx}'
const globPattern = PATTERN || defaultPattern
const categories = CATEGORIES ? CATEGORIES.split(',') : null

const filterAll = key => {
  const [, category] = key.split('/')

  return categories ? categories.includes(category) : micromatch.isMatch(key, globPattern, {contains: true})
}

// Require all the files from a context
const importAll = request => request.keys().filter(filterAll).forEach(request)

// Avoid running Karma until all components tests are loaded
const originalKarmaLoader = window.__karma__.loaded
window.__karma__.loaded = () => {}

const testsFiles = require.context(
  `${__BASE_DIR__}/components/`,
  true,
  /\.\/(\w+)\/(\w+)\/test\/(components\.)?(\w+).test.(js|jsx|ts|tsx)/
)

const selectedTestFiles = testsFiles.keys().filter(filterAll)

Promise.all(
  selectedTestFiles.map(async key => {
    // get the category component from the segments of the path
    // ex: ./card/property/index.js -> card property
    const [, category, component] = key.split('/')

    let categoryComponentKey = `${category}/${component}`
    let subComponentName = null

    const subComponentRegex = /components\.(?<nestedComponentName>\w+)\.test\.(js|jsx)/
    const matchesSubComponent = key.match(subComponentRegex)

    if (matchesSubComponent !== null) {
      subComponentName = matchesSubComponent?.groups?.nestedComponentName
      categoryComponentKey = `${category}/${component}/src/${subComponentName}`
    }

    const getContexts = await importContexts({category, component})
    const contexts = typeof getContexts === 'function' ? await getContexts() : getContexts

    const componentModule = await importReactComponent({
      category,
      component,
      subComponentName,
      extractDefault: true
    })

    const Component = componentModule && (componentModule.type || componentModule)

    if (!componentModule) {
      console.error(`Could not find component ${categoryComponentKey} in ${key}`)
      console.error(`Available keys: `, selectedTestFiles.keys())
      throw new Error(`Missing export default from ${categoryComponentKey}`)
    }

    const {displayName} = Component
    // store on the window the contexts and components using the ${category/component} key
    // or the ${category/component/src/subComponentName} key if using a nested component
    window.__STUDIO_CONTEXTS__[categoryComponentKey] = contexts
    window.__STUDIO_COMPONENT__[categoryComponentKey] = Component

    const ComponentWithReactContext = addReactContextToComponent(Component, {
      context: contexts.default,
      id: categoryComponentKey
    })

    // if the Component has a displayName, we're going to make the Component
    // available through the window object with the default context without importing it
    if (displayName) {
      window[displayName] = ComponentWithReactContext
    }
  })
)
  .then(() => {
    // in order to force all tests, we're importing all the files that matches the pattern
    importAll(testsFiles)
    // we're ready to go
    originalKarmaLoader.call(window.__karma__)
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error(err)
  })
