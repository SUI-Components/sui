import EmptyUseCaseWithLogger from './EmptyUseCaseWithLogger.js'

export default class FactoryWithMultipleUseCases {
  static useCaseOne({config, logger}) {
    return new EmptyUseCaseWithLogger({config, logger})
  }

  static useCaseTwo({config, logger}) {
    return new EmptyUseCaseWithLogger({config, logger})
  }
}
