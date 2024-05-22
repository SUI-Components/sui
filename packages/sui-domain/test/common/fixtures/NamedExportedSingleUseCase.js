class UseCase {
  constructor({config}) {
    this._config = config
  }

  static create({config}) {
    return new UseCase({config})
  }

  execute() {
    return Promise.resolve(true)
  }
}

export const factory = UseCase.create
