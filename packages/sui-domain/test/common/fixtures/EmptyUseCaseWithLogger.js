export default class UseCase {
  constructor({config, logger}) {
    this._config = config
    this._logger = logger
  }

  execute() {
    this._logger.log('log mock')
    this._logger.error('error mock')
    this._logger.metric('metric mock')
    return Promise.resolve(true)
  }
}
