import createNotImplementedUseCase from './createNotImplementedUseCase.js'

const METHODS_BY_FACTORY_TYPES = {
  // Return a method from a whole default exported factory
  WHOLE_FACTORY: (factory, method) => factory.default[method],
  // Return a single default exported factory
  DEFAULT_SINGLE_FACTORY: factory => factory.default,
  // Return a single named exported factory
  NAMED_SINGLE_FACTORY: ({factory}) => factory
}

export default ({useCases, config, logger, pde}) =>
  class EntryPoint {
    subscribers = {}

    constructor(params = {}) {
      // decide to use a static config from the factory
      // or use a config passed to the constructor that could be mutated
      this._config = params.config || config || {}
      this._useCases = useCases
      this._logger = params.logger || logger || {}
      this._pde = params.pde || pde || {}
    }

    /**
     * Retrieves one entry from the public dictionary
     * The dictionary will contain the use cases and configuration
     * @example
     * const configuration = domain.get('config')
     * const useCase = domain.get('phone_contact_use_case')
     * @param {string} key The name of the use case or indicate that we want to get the config
     * @return {function|{execute: Function, $: object}|NotImplementedUseCase}
     */
    get(key) {
      // config key is still sync and we should return as it
      if (key === 'config') {
        return this._config
      }
      // get the useCase using the key passed by the user
      const useCase = this._useCases[key]
      // if the useCase doesn't exist, then let developer know that the useCase is not implemented
      if (typeof useCase === 'undefined') return createNotImplementedUseCase(key)

      const isDynamicImportWholeFactory = useCase instanceof Array

      const [loader, method] = isDynamicImportWholeFactory
        ? useCase // for the whole factory we extract the single method from the array
        : [useCase] // for the single factory, the method is undefined as is default

      const getMethodByFactoryType = receivedFactory => {
        if (isDynamicImportWholeFactory) return METHODS_BY_FACTORY_TYPES.WHOLE_FACTORY

        // according with the creational pattern entryPoint agreement
        const hasNamedExportedMethod = Boolean(receivedFactory.factory)

        return hasNamedExportedMethod
          ? METHODS_BY_FACTORY_TYPES.NAMED_SINGLE_FACTORY
          : METHODS_BY_FACTORY_TYPES.DEFAULT_SINGLE_FACTORY
      }

      const getMethod = factory => getMethodByFactoryType(factory)(factory, method)

      // if loader is undefined then is not implemented, otherwhise load async the useCase
      return loader === undefined
        ? createNotImplementedUseCase(key)
        : {
            execute: params => {
              const subscriptionsForUseCase = this.subscribers[key] || []
              // load async the factory, execute use case and return the promise
              return loader()
                .then(factory =>
                  getMethod(factory)({
                    config: this._config,
                    logger: this._logger,
                    pde: this._pde
                  }).execute(params)
                )
                .then(result => {
                  subscriptionsForUseCase.forEach(fn => fn({error: null, params, result}))
                  return result
                })
                .catch(e => {
                  subscriptionsForUseCase.forEach(fn => fn({error: e, params, result: null}))
                  return Promise.reject(e)
                })
            },
            subscribe: callback => {
              this.subscribers[key] = this.subscribers[key] || []
              this.subscribers[key].push(callback)

              // return a way to remove the listener
              return {
                unsubscribe: () => {
                  this.subscribers[key] = this.subscribers[key].filter(l => l !== callback)
                }
              }
            },
            $: {
              // support deprecated decorator @streamify
              execute: {
                subscribe: (onNext, onError) => {
                  // creating an object here that will have a dispose method
                  const ret = {dispose: function () {}}
                  loader().then(factory => {
                    // black magic: mutate the object, very small memory leak but that
                    // makes dispose working async and we need it
                    ret.dispose = getMethod(factory)({
                      config: this._config,
                      logger: this._logger,
                      pde: this._pde
                    }).$.execute.subscribe(onNext, onError).dispose
                  })
                  // return the object that will be mutated async
                  return ret
                }
              }
            }
          }
    }

    /**
     * Set a value to a key in the config
     * @example
     * const configuration = domain.config('new_config', 'new value')
     * @param {String} key
     * @param {String} value
     * @return {this}
     */
    config(key, value) {
      this._config.set(key, value)
      return this
    }
  }
