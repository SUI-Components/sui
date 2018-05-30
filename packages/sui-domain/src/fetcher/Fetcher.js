/**
 * @interface
 * */
export default class Fetcher {
  /**
   * @method
   * @return {Error}
   */
  get() {
    throw new Error('[Fetcher#get] must be implemented')
  }

  /**
   * @method
   * @return {Error}
   */
  post() {
    throw new Error('[Fetcher#post] must be implemented')
  }

  /**
   * @method
   * @return {Error}
   */
  put() {
    throw new Error('[Fetcher#put] must be implemented')
  }

  /**
   * @method
   * @return {Error}
   */
  delete() {
    throw new Error('[Fetcher#delete] must be implemented')
  }
}
