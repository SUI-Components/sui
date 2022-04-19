/* global __BASE_DIR__, CATEGORIES, COMPONENT */

/**
 * This file is being executed in browser opened to run tests
 */
import {importContexts, importReactComponent} from '../components/tryRequire.js'
import {addSetupEnvironment} from '../environment-mocha/setupEnvironment.js'
import {addReactContextToComponent} from '../components/utils.js'

addSetupEnvironment(window)

window.__STUDIO_CONTEXTS__ = {}
window.__STUDIO_COMPONENT__ = {}

const componentPath = COMPONENT
const pattern = CATEGORIES
const categories = pattern ? pattern.split(',') : null

const filterCategories = key => {
  const [, category] = key.split('/')
  return !categories || categories.includes(category)
}

const filterComponent = key => {
  const [, category, component] = key.split('/')
  return !componentPath || componentPath === `${category}/${component}`
}

// Require all the files from a context
const importAll = request =>
  request
    .keys()
    .filter(filterCategories)
    .filter(filterComponent)
    .forEach(request)

// Avoid running Karma until all components tests are loaded
const originalKarmaLoader = window.__karma__.loaded
window.__karma__.loaded = () => {}

const testsFiles = require.context(
  `${__BASE_DIR__}/components/`,
  true,
  /\.\/(\w+)\/(\w+)\/test\/(\w+).test.(js|jsx)/
)

const selectedTestFiles = testsFiles
  .keys()
  .filter(filterCategories)
  .filter(filterComponent)

Promise.all(
  selectedTestFiles.map(async key => {
    // get the category component from the segments of the path
    // ex: ./card/property/index.js -> card property
    const [, category, component] = key.split('/')
    const categoryComponentKey = `${category}/${component}`

    const getContexts = await importContexts({category, component})
    const contexts =
      typeof getContexts === 'function' ? await getContexts() : getContexts

    const componentModule = await importReactComponent({
      category,
      component,
      extractDefault: true
    })

    const Component =
      componentModule && (componentModule.type || componentModule)

    if (!componentModule) {
      console.error(
        `Could not find component ${categoryComponentKey} in ${key}`
      )
      console.error(`Available keys: `, selectedTestFiles.keys())
      throw new Error(`Missing export default from ${categoryComponentKey}`)
    }

    const {displayName} = Component
    // store on the window the contexts and components using the ${category/component} key
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
