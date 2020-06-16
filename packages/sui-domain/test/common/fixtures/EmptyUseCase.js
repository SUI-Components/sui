export default class UseCase {
  constructor({config}) {
    this._config = config
  }

  execute() {
    return Promise.resolve(true)
  }
}
