import {Mocker, Mock} from './mockerInterface.js'
import nock from 'nock'

class ServerMocker extends Mocker {
  restore() {
    nock.cleanAll()
  }

  httpMock(baseUrl) {
    return new ServerMock(nock, baseUrl)
  }
}

class ServerMock extends Mock {
  constructor(server, baseUrl) {
    super()
    this._server = server
    this._baseUrl = baseUrl
    this._method = null
    this._query = null
    this._path = null
  }

  get(path) {
    this._method = 'get'
    this._path = path

    return this
  }

  getRegexp(path) {
    this.get(path)
    this._path = RegExp(path)

    return this
  }

  patch(path) {
    this._method = 'patch'
    this._path = path

    return this
  }

  post(path) {
    this._method = 'post'
    this._path = path

    return this
  }

  put(path) {
    this._method = 'put'
    this._path = path

    return this
  }

  delete(path) {
    this._method = 'delete'
    this._path = path

    return this
  }

  query(queryObject) {
    this._query = queryObject

    return this
  }

  reply(response, statusCode = 200) {
    const mock = this._server(this._baseUrl)[this._method](this._path)

    if (this._query) {
      mock.query(this._query)
    }

    mock.reply(statusCode, JSON.stringify(response))

    return this
  }
}

export default ServerMocker
