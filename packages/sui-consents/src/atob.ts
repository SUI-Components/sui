/**
 * Isomorphic atob solution
 */
export default (encodedData: string): string => {
  if (typeof window !== 'undefined') {
    return window.atob(encodedData)
  }

  return Buffer.from(encodedData, 'base64').toString('binary')
}
