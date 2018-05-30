/* eslint no-console:0 */
import UseCase from './UseCase'

/**
 * This is the default use case returned
 * by the domain when asking for a not implemented
 * use case. It allows to work on the client with
 * a work in progress feature. The execute() method
 * returns a promise which warns in console that
 * the requested method is not implemented yet.
 *
 * */
export default class NotImplementedUseCase extends UseCase {
  /**
   * @param {string} key The requested use case not being implemented
   */
  constructor(key) {
    super()
    this._key = key
  }

  /**
   * @override
   */
  execute() {
    return Promise.resolve(
      console.warn(
        `Service ${
          this._key
        } is not implemented in the current version of the domain`
      )
    )
  }
}
