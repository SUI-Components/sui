/**
 * Class AnemicModel have the responsibility of implement the common constructor and toJSON
 * code routines and make it transparent to our consumer.
 */
export default class AnemicModel {
  constructor (properties = {}) {
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
  toJSON () {
    return Object.keys(this).reduce((resultObject, key) => {
      const replacedKey = key.replace('_', '')

      if (!this._properties.hasOwnProperty(replacedKey)) {
        return resultObject
      }

      if (this._properties[replacedKey] instanceof AnemicModel) {
        return {
          ...resultObject,
          [replacedKey]: this._properties[replacedKey].toJSON()
        }
      }

      if (Array.isArray(this._properties[replacedKey])) {
        resultObject[replacedKey] = this._properties[replacedKey].map(obj => {
          if (obj instanceof AnemicModel) {
            return obj.toJSON()
          }

          return obj
        })

        return resultObject
      }

      resultObject[replacedKey] = this._properties[replacedKey]
      return resultObject
    }, {})
  }
}
