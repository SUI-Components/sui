export default class DomainBuilder {
  static extend({domain = {}}) {
    return new DomainBuilder({domain})
  }

  constructor({domain} = {}) {
    this._domain = domain
    this._useCase = false
    this._config = domain.get('config')
    this._useCases = {}
  }

  mockUseCases(mocks) {
    mocks.forEach(
      ([useCase, respondWith]) => (this._useCases[useCase] = respondWith)
    )
    return this
  }

  for({useCase} = {}) {
    if (this._useCase) {
      throw new Error(
        `[DomainBuilder#for] There is already an use case ${this._useCases}.
         Set up a response with DomainBuilder#respondWith before setting up another use case`
      )
    }

    this._useCase = useCase
    return this
  }

  respondWith({success, fail} = {}) {
    if (success !== undefined && fail !== undefined) {
      throw new Error(
        '[DomainBuilder#respondWith] The response must set an object with success or fail prop, but not both'
      )
    }

    if (success === undefined && fail === undefined) {
      throw new Error(
        '[DomainBuilder#respondWith] Neither success nor fail are set'
      )
    }

    if (!this._useCase) {
      throw new Error(
        '[DomainBuilder#respondWith] before setting a response you must set up a use case using the DomainBuilder#for function'
      )
    }

    this._useCases[this._useCase] = {success, fail}
    this._useCase = false

    return this
  }

  build({inlineError} = {}) {
    const self = this
    const exeUseCase = useCase => params => {
      const {fail, success} = self._useCases[useCase]

      const data = typeof success === 'function' ? success(params) : success

      const responseParams =
        data !== undefined ? {err: null, data} : {err: fail, data: null}

      const createResponse = ({err, data}) => {
        if (inlineError) return Promise.resolve([err, data])
        return err ? Promise.reject(err) : Promise.resolve(data)
      }
      return createResponse(responseParams)
    }

    const buildGet = useCase => {
      if (useCase === 'config') {
        return this._config
      }
      if (self._useCases[useCase]) {
        return {execute: exeUseCase(useCase)}
      }
      return self._domain.get(useCase)
    }

    return {
      get: buildGet,
      _map: Object.assign(self._domain._map || {}, self._useCases),
      useCases: Object.assign(self._domain.useCases || {}, self._useCases)
    }
  }
}
