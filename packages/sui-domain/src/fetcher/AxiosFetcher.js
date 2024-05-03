import axios from 'axios'

import {CircuitBreaker} from './CircuitBreaker.js'

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

  /**
   * Get method
   * @param {String} url
   * @param {Object} options
   * @return {Promise<any>}
   */
  get(url, options) {
    return new CircuitBreaker(this._axios.get(url, options)).fire()
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
    return new CircuitBreaker(this._axios.post(url, body, options)).fire()
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
    return new CircuitBreaker(this._axios.put(url, body, options)).fire()
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
    return new CircuitBreaker(this._axios.patch(url, body, options)).fire()
  }

  /**
   * Delete method
   * @method delete
   * @param {String} url
   * @param {Object} options
   * @return {Object}
   */
  delete(url, options) {
    return new CircuitBreaker(this._axios.delete(url, options)).fire()
  }
}
