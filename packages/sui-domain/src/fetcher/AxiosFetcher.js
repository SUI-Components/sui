import axios from 'axios'

/** @typedef {import('./FetcherInterface').default} FetcherInterface */
/** @implements {FetcherInterface} */
export default class AxiosFetcher {
  /**
   * @param {object} deps
   * @param {object} deps.config
   */
  constructor({config}) {
    this._axios = axios.create(config)
    this._initInterceptors()
  }

  /**
   * Initializes interceptors
   */
  _initInterceptors() {
    this._axios.interceptors.response.use(
      this._interceptResponse,
      this._interceptError
    )
  }

  /**
   * Intercepts all responses and, in case an interceptor has been defined, calls it
   * @param {Object} response
   * @returns {Object}
   */
  _interceptResponse(response) {
    if (AxiosFetcher.responseInterceptor !== undefined)
      AxiosFetcher.responseInterceptor(response)

    return response
  }

  /**
   * Intercepts all errors and, in case an interceptor has been defined, calls it
   * @param {Error} error
   * @returns {Error}
   */
  _interceptError(error) {
    if (AxiosFetcher.errorInterceptor !== undefined)
      AxiosFetcher.errorInterceptor(error)

    return error
  }

  /**
   * Defines which function will be called when an error occurs
   * @param {Function} interceptor
   */
  setErrorInterceptor(interceptor) {
    AxiosFetcher.errorInterceptor = interceptor
  }

  /**
   * Defines which function will be called when a response is received
   * @param {Function} interceptor
   */
  setResponseInterceptor(interceptor) {
    AxiosFetcher.responseInterceptor = interceptor
  }

  /**
   * Get method
   * @param {String} url
   * @param {Object} options
   * @return {Promise<any>}
   */
  get(url, options) {
    return this._axios.get(url, options)
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
    return this._axios.post(url, body, options)
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
    return this._axios.put(url, body, options)
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
    return this._axios.patch(url, body, options)
  }

  /**
   * Delete method
   * @method delete
   * @param {String} url
   * @param {Object} options
   * @return {Object}
   */
  delete(url, options) {
    return this._axios.delete(url, options)
  }
}
