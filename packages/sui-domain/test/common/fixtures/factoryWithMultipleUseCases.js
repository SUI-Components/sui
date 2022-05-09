import EmptyUseCase from './EmptyUseCase.js'

export default class FactoryWithMultipleUseCases {
  static useCaseOne({config}) {
    return new EmptyUseCase({config})
  }

  static useCaseTwo({config}) {
    return new EmptyUseCase({config})
  }
}
