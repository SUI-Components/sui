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
  }

  get CircuitBreaker() {
    return this._config.get('circuitBreaker')
      ? this._config.get('circuitBreaker')
      : {
          fire: (requester, url, options, body) => {
            requester.call(requester, url, body ?? options, options)
          }
        }
  }

  /**
   * Get method
   * @param {String} url
   * @param {Object} options
   * @return {Promise<any>}
   */
  get(url, options) {
    return this.CircuitBreaker.fire(this._axios.get, url, options)
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
    return this.CircuitBreaker.fire(this._axios.post, url, options, body)
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
    return this.CircuitBreaker.fire(this._axios.put, url, options, body)
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
    return this.CircuitBreaker.fire(this._axios.patch, url, options, body)
  }

  /**
   * Delete method
   * @method delete
   * @param {String} url
   * @param {Object} options
   * @return {Object}
   */
  delete(url, options) {
    return this.CircuitBreaker.fire(this._axios.delete, url, options)
  }
}
