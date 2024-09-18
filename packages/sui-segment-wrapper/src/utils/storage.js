// @ts-check

/**
 * Use this module to store and retrieve data from localStorage or sessionStorage
 * @param {object} params
 * @param {string} params.key
 * @param {'getItem'|'removeItem'|'setItem'=} params.method
 * @param {'localStorage'|'sessionStorage'=} params.type
 * @param {string=} params.value
 * @returns {string|void}
 */
export const storage = ({type = 'localStorage', method = 'getItem', key, value}) => {
  try {
    return window[type][method](key, value)
  } catch (e) {
    console.error(e)
  }
}
