import {FakeGenerator} from './FakeGenerator'
import {MockFetcherManager} from './Fetcher'

class MotherObject {}

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

    generate() {
      throw new Error('[RequestMotherObject#generate] Should be implemented')
    }

    request({url, method = 'get'}) {
      this._url = url
      this._method = method
      return this
    }

    get faker() {
      return this._faker
    }

    success() {
      if (this._error !== undefined)
        throw new Error('[RequestMotherObject#success] Dont call to .success after call to .error method')

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
        throw new Error('[RequestMotherObject#error] Dont call to .error after call to .success method')

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
  }
