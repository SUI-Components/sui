/**
 * Isomorphic atob solution
 * @param {string} encodedData
 * @returns {string}
 */
export default encodedData => {
  if (typeof window !== 'undefined') {
    return window.atob(encodedData)
  }

  return Buffer.from(encodedData, 'base64').toString('binary')
}
