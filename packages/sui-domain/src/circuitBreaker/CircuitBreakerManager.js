import {CircuitBreaker} from './CircuitBreaker.js'

export class CircuitBreakerManager {
  activeRequests = {}

  constructor({options}) {
    this._options = options
  }

  async fire(requester, url, requestOptions) {
    const key = `${requestOptions.method}#${url}`
    if (!this.activeRequests[key]) this.activeRequests[key] = new CircuitBreaker({options: this._options})

    return this.activeRequests[key].fire(requester, url, requestOptions)
  }
}
