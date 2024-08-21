let _instance
export class MockFetcherManager {
  _fakeRequests
  _methods = ['get', 'patch', 'post']

  static create(FetchFetcher, {InlineError}) {
    if (_instance) return _instance
    _instance = new MockFetcherManager(FetchFetcher, {InlineError})
    return _instance
  }

  static restore() {
    if (!_instance) return console.warn('Unable to restore a non-initialized MockFetcherManager')
    _instance.restore()
    _instance = undefined
  }

  constructor(FetchFetcher, {InlineError}) {
    this.FetchFetcher = FetchFetcher
    this._originalsFetcher = this._methods.map(method => this.FetchFetcher.prototype[method])
    this._fakeRequests = {}
    this._hasInlineErrors = InlineError
    this._methods.forEach(method => {
      this.FetchFetcher.prototype[method] = this._request(method)
    })
  }

  addMock({url, method, error, mock, force}) {
    const key = method.toUpperCase() + '::' + url
    if (!force && this._fakeRequests[key])
      throw new Error(`[MockFetcherManager#addMock] forbidden overwrite the request ${key}`)

    this._fakeRequests[key] = [error, mock]
  }

  validate({url, method}) {
    const key = method.toUpperCase() + '::' + url
    if (this._fakeRequests[key]) throw new Error(`[MockFetcherManager#validate] request ${key} don't consume`)
  }

  restore() {
    if (Object.keys(this._fakeRequests).length === 0) {
      this._methods.forEach((method, index) => (this.FetchFetcher.prototype[method] = this._originalsFetcher[index]))
    } else {
      throw new Error(`[MockFetcherManager#restore]
        Unabled restore the FetchFetcher because there are request w/out been consume
        - Dont match any mock:
        ${Object.keys(this._fakeRequests).join('\n\t\t')}
      `)
    }
  }

  _request(method) {
    const self = this
    return function (...args) {
      const [url] = args
      const requestKey = method.toUpperCase() + '::' + url
      // this === FetchFetcher instance
      if (self._fakeRequests[requestKey]) {
        const [error, response] = self._fakeRequests[requestKey]
        delete self._fakeRequests[requestKey]
        if (!self._hasInlineErrors) return error ? Promise.reject(error) : Promise.resolve({data: response})

        return Promise.resolve([error, response])
      } else {
        console.warn(`[MockFetcherManager#_request]
        - Request make ${requestKey}
        - Dont match any mock:
        ${Object.keys(self._fakeRequests).join('\n\t\t')}
      `)
      }

      return this._originalsFetcher[method].apply(this, args)
    }
  }
}
