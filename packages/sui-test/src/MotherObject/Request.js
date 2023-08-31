import {FakeGenerator} from './FakeGenerator'

let _instance
class MotherObject {}

export class MockFetcherManager {
  _fakeRequests
  _methods = ['get', 'patch', 'post']

  static create(FetchFetcher, {InlineError}) {
    if (_instance) return _instance
    _instance = new MockFetcherManager(FetchFetcher, {InlineError})
    return _instance
  }

  static restore() {
    if (!_instance)
      return console.warn('Unabled restore a not init MockFetcherManager')
    _instance.restore()
    _instance = undefined
  }

  constructor(FetchFetcher, {InlineError}) {
    this.FetchFetcher = FetchFetcher
    this._originalsFetcher = this._methods.map(
      method => this.FetchFetcher.prototype[method]
    )
    this._fakeRequests = {}
    this._hasInlineErrors = InlineError
    this._methods.forEach(method => {
      this.FetchFetcher.prototype[method] = this._request(method)
    })
  }

  addMock({url, method, error, mock, force}) {
    const key = method.toUpperCase() + '::' + url
    if (!force && this._fakeRequests[key])
      throw new Error(
        `[MockFetcherManager#addMock] forbidden overwrite the request ${key}`
      )

    this._fakeRequests[key] = [error, mock]
  }

  validate({url, method}) {
    const key = method.toUpperCase() + '::' + url
    if (this._fakeRequests[key])
      throw new Error(
        `[MockFetcherManager#validate] request ${key} don't consume`
      )
  }

  restore() {
    if (Object.keys(this._fakeRequests).length === 0) {
      this._methods.forEach(
        (method, index) =>
          (this.FetchFetcher.prototype[method] = this._originalsFetcher[index])
      )
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
        if (!self._hasInlineErrors)
          return error
            ? Promise.reject(error)
            : Promise.resolve({data: response})

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

export const RequestMotherObjectFactory = (FetchFetcher, {InlineError}) =>
  class RequestMotherObject extends MotherObject {
    _url
    _method
    _error
    _mock

    constructor() {
      super()
      this._mockFetcherManager = MockFetcherManager.create(FetchFetcher, {
        InlineError
      })
      this._faker = FakeGenerator.create()
    }

    request({url, method = 'get'}) {
      this._url = url
      this._method = method
      return this
    }

    success() {
      if (this._error !== undefined)
        throw new Error(
          '[RequestMotherObject#success] Dont call to .success after call to .error method'
        )

      this._mock = this.generate(this._faker)

      this._mockFetcherManager.addMock({
        url: this._url,
        method: this._method,
        mock: this._mock
      })
      return this
    }

    error({error}) {
      if (!error)
        throw new Error(
          '[RequestMotherObject#error] if want to return an error from the API you must to instanciate a error'
        )

      if (this._mock !== undefined)
        throw new Error(
          '[RequestMotherObject#error] Dont call to .error after call to .success method'
        )

      this._error = error
      this._mockFetcherManager.addMock({
        url: this._url,
        method: this._method,
        error: this._error
      })
      return this
    }

    toJSON() {
      return this._error ? this._error : this._mock
    }

    get mock() {
      return this._mock
    }

    set mock(nextMock) {
      this._mock = nextMock
      this.updateMock()
    }

    updateMock() {
      this._mockFetcherManager.addMock({
        url: this._url,
        method: this._method,
        mock: this._mock,
        force: true
      })
      return this
    }

    validate() {
      if (!this._url && !this._method) return
      this._mockFetcherManager.validate({
        url: this._url,
        method: this._method
      })
    }

    restore() {
      this._mockFetcherManager.restore()
    }
  }
