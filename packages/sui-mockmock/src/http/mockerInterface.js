/**
 * @interface
 */
class Mock {
  get (path) {}
  getRegexp (path) {}
  post (path) {}
  query (queryObject) {}
  reply (response, statusCode) {}
}

/**
 * @interface
 */
class Mocker {
  create () {}
  restore () {}
  httpMock (baseUrl) {}
}

export {Mocker, Mock}
