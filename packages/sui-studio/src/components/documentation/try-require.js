/* global requires */

import /* codegen */ './codegen.js'

/* section could be: 'src', 'changelog' or 'readme' */
const tryRequire = ({category, component, section = 'src'}) => {
  const requireComponent = requires[`${category}/${component}`]
  return new Promise(resolve => {
    requireComponent[section](requirePromise => requirePromise(resolve))
  })
}

export default tryRequire
