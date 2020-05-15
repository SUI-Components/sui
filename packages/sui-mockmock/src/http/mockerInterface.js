/**
 * @interface
 */
class Mock {
  get(path) {}
  getRegexp(path) {}
  patch(path) {}
  post(path) {}
  query(queryObject) {}
  reply(response, statusCode) {}
  toStandardRequest(request) {
    throw new Error('Mock#toStandardRequest must be implemented')
  }

  requestNTH(index) {
    throw new Error('Mock#requestNTH must be implemented')
  }
}

/**
 * @interface
 */
class Mocker {
  create() {}
  restore() {}
  httpMock(baseUrl) {}
}

export {Mocker, Mock}
