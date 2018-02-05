export default class DomainBuilder {
  static extend ({domain = {}}) {
    return new DomainBuilder({domain})
  }

  constructor ({domain} = {}) {
    this._domain = domain
    this._useCase = false
    this._config = domain.get('config')
    this._useCases = {}
  }

  for ({useCase} = {}) {
    if (this._useCase) {
      throw new Error(
        `[DomainBuilder#for] An useCase was setting with value ${this._useCases}.
         setup a response with DomainBuilder#respondWith until setup other use case`
      )
    }

    this._useCase = useCase
    return this
  }

  respondWith ({success, fail} = {}) {
    if (success !== undefined && fail !== undefined) {
      throw new Error('[DomainBuilder#respondWith] The respond must be success or failer but not both')
    }

    if (success === undefined && fail === undefined) {
      throw new Error('[DomainBuilder#respondWith] success or fail are undefined')
    }

    if (!this._useCase) {
      throw new Error(
        '[DomainBuilder#respondWith] before setting a response must setting a usecase with DomainBuilder#for'
      )
    }

    this._useCases[this._useCase] = {success, fail}
    this._useCase = false

    return this
  }

  build () {
    const self = this
    return {
      get: useCase => {
        if (useCase === 'config') { return this._config }
        return self._useCases[useCase] ? {
          execute: params => {
            const successResponse = self._useCases[useCase]['success']
            return self._useCases[useCase]['success'] !== undefined
              ? Promise.resolve(
                typeof successResponse === 'function' ? successResponse(params) : successResponse
              )
              : Promise.reject(self._useCases[useCase]['fail'])
          }
        } : self._domain.get(useCase)
      },
      _map: Object.assign(self._domain._map, self._useCases),
      useCases: Object.assign((self._domain.useCases || {}), self._useCases)
    }
  }
}
