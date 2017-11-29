import NotImplementedUseCase from './NotImplementedUseCase'

export default class EntryPoint {
  constructor ({ config, useCases }) {
    this._config = config
    this._useCases = useCases
  }

  /**
   * Retreives one entry from the public dictionary
   * The dictionary will contain the use cases and configuration
   * @example
   * const configuration = domain.get('config')
   * const useCase = domain.get('phone_contact_use_case')
   * @param {string} key The name of the use case or indicate that we want to get the config
   * @return (config|UseCase)
   */
  get (key) {
    // config key is still sync and we should return as it
    if (key === 'config') {
      return this._config
    }

    // get the loader and the method from the useCases
    const [loader, method] = this._useCases[key] || []
    // if loader is undefined then is not implemented, otherwhise load async the useCase
    return loader === undefined
            ? new NotImplementedUseCase(key)
            : {
              execute: (params) => {
                // load async the factory, execute use case and return the promise
                return loader().then(factory => factory.default[method]().execute(params))
              },
              $: {
                execute: {
                  subscribe: (fn) => {
                    // creating an object here without an empty dispose function
                    let ret = { dispose: function () {} }
                    loader().then(factory => {
                      // black magic: mutate the object, very small memory leak but that
                      // makes dispose working async and we need it
                      ret.dispose = factory.default[method]().$.execute.subscribe(fn).dispose
                    })
                    // return the object that will be mutated async
                    return ret
                  }
                }
              }
            }
  }

  config (key, value) {
    this._config.set(key, value)
    return this
  }
}
