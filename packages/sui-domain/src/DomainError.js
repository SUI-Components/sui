/**
 * Base class for handling errors in the domain layer
 */
export default class DomainError extends Error {
  constructor({code, message, cause}) {
    super(message, {cause})
    this.name = 'DomainError'
    this.code = code
  }

  /**
   * DomainError factory method
   *
   * @param {String} code Code to identify the error instance. It's required.
   * @param {String} message Description for the error useful for giving more context.
   * @param {Object} cause Keeps the original error useful for wrapping uncontrolled errors.
   */
  static create({code, message, cause}) {
    if (!code) {
      throw new Error('[DomainError] The code property is required.')
    }

    return new DomainError({code, message, cause})
  }
}
