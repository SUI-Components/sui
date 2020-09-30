/* global __BASE_DIR__ */
import {importContexts, importReactComponent} from '../components/tryRequire'
import {addSetupEnvironment} from '../environment-mocha/setupEnvironment'
import {addReactContextToComponent} from '../components/utils'

addSetupEnvironment(window)

window.__STUDIO_CONTEXTS__ = {}
window.__STUDIO_COMPONENT__ = {}

// Require all the files from a context
const importAll = r => r.keys().forEach(r)

// Avoid running Karma until all components tests are loaded
const originalKarmaLoader = window.__karma__.loaded
window.__karma__.loaded = () => {}

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
    importAll(allTestsFiles)
    // we're ready to go
    originalKarmaLoader.call(window.__karma__)
  })
  .catch(err => {
    console.error(err)
  })
