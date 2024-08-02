const path = require('path')

function isFileInsideFolder({context, pattern}) {
  if (!context) return false

  const filePath = context.getFilename()
  const relativePath = path.relative(context.getCwd(), filePath)
  return pattern.test(relativePath)
}

function isARepository({context = null, classObject}) {
  // Check if the file is inside required folders (repositories)
  const pattern = /repositories/i
  const isRepositoryPath = isFileInsideFolder({context, pattern})

  // Check if class has the Repository suffix or extends from Repository
  const className = classObject?.id?.name
  const superClassName = classObject?.superClass?.name

  const containRepository = className?.endsWith('Repository')
  const extendsRepository = superClassName === 'Repository'
  const isRepository = containRepository || extendsRepository || isRepositoryPath

  return isRepository
}

function isAService({context = null, classObject}) {
  // Check if the file is inside required folders (services)
  const pattern = /services/i
  const isServicePath = isFileInsideFolder({context, pattern})

  // Check if class has the Service suffix or extends from Service
  const className = classObject?.id?.name
  const superClassName = classObject?.superClass?.name

  const containService = className?.endsWith('Service')
  const extendsService = superClassName === 'Service'
  const isService = containService || extendsService || isServicePath

  return isService
}

function isAUseCase({context = null, classObject}) {
  // Check if the file is inside required folders (useCases, usecases, ...)
  const pattern = /useCases|usecases/i
  const isUseCasePath = isFileInsideFolder({context, pattern})

  // Check if class has the UseCase suffix or extends from UseCase
  const className = classObject?.id?.name
  const superClassName = classObject?.superClass?.name

  const containUseCase = className?.endsWith('UseCase')
  const extendsUseCase = superClassName === 'UseCase'
  const isUsecase = containUseCase || extendsUseCase || isUseCasePath

  return isUsecase
}

module.exports.isAService = isAService
module.exports.isARepository = isARepository
module.exports.isAUseCase = isAUseCase
