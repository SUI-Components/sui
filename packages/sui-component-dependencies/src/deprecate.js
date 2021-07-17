/**
 * @callback DefaultCallback
 * @param {array} props
 * @param {string} propName
 * @param {string} componentName
 */
const defaultCallback = (props, propName, componentName) => {
  const deprecatedMessage = `The prop ${'\x1b[32m'}${propName}${'\u001b[39m'} is DEPRECATED on ${'\x1b[32m'}${componentName}${'\u001b[39m'}.`
  console.warn(deprecatedMessage)
}

/**
 * Deprecate warns the PropType checked wrapped by.
 * @param {function} validator:  PropType checker validator
 * @param {?DefaultCallback} callback: handles a previous check before the propType validator
 * @returns {function} PropType checker validator.
 */
const deprecate = function(validator, callback = defaultCallback) {
  return function(props, propName, componentName, ...rest) {
    console.log(props, propName, props[propName], process.env.NODE_ENV)
    if (props[propName] != null && process.env.NODE_ENV !== 'production') {
      callback(props, propName, componentName, ...rest)
    }
    return validator(props, propName, componentName, ...rest)
  }
}

export default deprecate
