/**
 * Recursively calls toJSON on each member
 * @param {Object} obj
 */
const mapValuesToPlainObjects = obj =>
  Object.keys(obj).reduce(
    (o, key) => {
      o[key] = obj[key]
      if (o[key] instanceof AnemicModel) o[key] = o[key].toJSON()
      if (o[key] instanceof Object) o[key] = mapValuesToPlainObjects(o[key])
      return o
    },
    obj instanceof Array ? [] : {}
  )

/**
 * Converts anemic instance to an object with public props
 * @param {AnemicModel} obj
 */
const anemicInstanceToObject = obj =>
  Object.keys(obj)
    .map(key => key.replace('_', ''))
    .filter(key => obj._properties.hasOwnProperty(key))
    .reduce((result, key) => {
      result[key] = obj._properties[key]
      return result
    }, {})

/**
 * Class AnemicModel have the responsibility of implement the common constructor and toJSON
 * code routines and make it transparent to our consumer.
 */
export default class AnemicModel {
  constructor(properties = {}) {
    Object.keys(properties).forEach(key => (this[`_${key}`] = properties[key]))
    Object.defineProperty(this, '_properties', {
      value: properties,
      writable: false,
      enumerable: false,
      configurable: false
    })
  }

  /**
   * Method toJSON will get our object keys and transform it to the same structure as our input object.
   * The method will:
   * 1 - replace key _myPropertyKey by myPropertyKey
   * 2 - Check if the property was existing on the base properties constructor object or was added later. If second it will not included on te toJSON
   * 3 - Check if the property is AnemicObject and call its toJSON method too to get their JSON aspect.
   * 4 - Check if is an array, if it is will check if is an AnemicObject and do the same as step 3
   * 5 - If any of the latest steps were successful it will return the property without the dash.
   *
   * @returns {*}
   */
  toJSON() {
    return mapValuesToPlainObjects(anemicInstanceToObject(this))
  }
}
