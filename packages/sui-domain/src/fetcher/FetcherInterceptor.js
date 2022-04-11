/** @typedef {import('./InterceptableFetcherInterface').default} InterceptableFetcherInterface */
/** @implements {InterceptableFetcherInterface} */
export default class FetcherInterceptor {
  _fetcher
  static errorInterceptor = null

  /**
   * @param {object} deps
   * @param {FetcherInterface} deps.fetcher
   */
  constructor({fetcher}) {
    this._fetcher = fetcher
  }

  /**
   * Checks if the result contains a promise
   * @param {object} result
   * @returns
   */
  _isPromiseType(result) {
    return typeof result === 'object' && 'then' in result
  }

  /**
   * Replaces the original result with a promise to intercept exceptions
   * @param {object} deps
   * @param {object} deps.originalResult
   * @returns
   */
  _interceptResult({originalResult}) {
    let result = originalResult

    if (this._isPromiseType(result)) {
      result = new Promise((resolve, reject) =>
        this._catchExceptions({resolve, reject, originalResult})
      )
    }

    return result
  }

  /**
   * Catches exceptions on the original result and calls the error interceptor
   * @param {object} deps
   * @param {object} deps.originalResult
   * @param {object} deps.reject
   * @param {object} deps.resolve
   */
  async _catchExceptions({originalResult, resolve, reject}) {
    try {
      const response = await originalResult
      resolve(response)
    } catch (error) {
      if (
        FetcherInterceptor.errorInterceptor !== null &&
        typeof FetcherInterceptor.errorInterceptor === 'function'
      ) {
        FetcherInterceptor.errorInterceptor(error)
      }

      reject(error)
    }
  }

  /**
   * Defines the function to be called when an error is intercepted
   * @param {object} deps
   * @param {object} deps.callback
   * @returns
   */
  setErrorInterceptor({callback}) {
    FetcherInterceptor.errorInterceptor = callback
  }

  /**
   * Unsets the function called when an error is intercepted
   */
  unsetErrorInterceptor() {
    FetcherInterceptor.errorInterceptor = null
  }

  /**
   * Get method
   * @param {String} url
   * @param {Object} options
   * @return {Promise<any>}
   */
  get(url, options) {
    const originalResult = this._fetcher.get(url, options)
    const result = this._interceptResult({originalResult})
    return result
  }

  /**
   * Post method
   * @method post
   * @param {String} url
   * @param {String} body
   * @param {Object} options
   * @return {Promise}
   */
  post(url, body, options) {
    const originalResult = this._fetcher.post(url, body, options)
    const result = this._interceptResult({originalResult})
    return result
  }

  /**
   * Put method
   * @method put
   * @param {String} url
   * @param {String} body
   * @param {Object} options
   * @return {Object}
   */
  put(url, body, options) {
    const originalResult = this._fetcher.put(url, body, options)
    const result = this._interceptResult({originalResult})
    return result
  }

  /**
   * Patch method
   * @method patch
   * @param {String} url
   * @param {String} body
   * @param {Object} options
   * @return {Object}
   */
  patch(url, body, options) {
    const originalResult = this._fetcher.patch(url, body, options)
    const result = this._interceptResult({originalResult})
    return result
  }

  /**
   * Delete method
   * @method delete
   * @param {String} url
   * @param {Object} options
   * @return {Object}
   */
  delete(url, options) {
    const originalResult = this._fetcher.delete(url, options)
    const result = this._interceptResult({originalResult})
    return result
  }
}
