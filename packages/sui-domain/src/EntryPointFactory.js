import createNotImplementedUseCase from './createNotImplementedUseCase'

export default ({useCases, config}) =>
  class EntryPoint {
    subscribers = {}

    constructor(params = {config: {}}) {
      // decide to use a static config from the factory
      // or use a config passed to the constructor that could be mutated
      this._config = config || params.config
      this._useCases = useCases
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
      if (typeof useCase === 'undefined')
        return createNotImplementedUseCase(key)

      const isDynamicImportWholeFactory = useCase instanceof Array

      const [loader, method] = isDynamicImportWholeFactory
        ? useCase // for the whole factory we extract the single method from the array
        : [useCase] // for the single factory, the method is undefined as is default

      const getMethod = isDynamicImportWholeFactory
        ? factory => factory.default[method]
        : factory => factory.default

      // if loader is undefined then is not implemented, otherwhise load async the useCase
      return loader === undefined
        ? createNotImplementedUseCase(key)
        : {
            execute: params => {
              const subscriptionsForUseCase = this.subscribers[key] || []
              // load async the factory, execute use case and return the promise
              return loader()
                .then(factory =>
                  getMethod(factory)({config: this._config}).execute(params)
                )
                .then(result => {
                  subscriptionsForUseCase.forEach(fn =>
                    fn({error: null, params, result})
                  )
                  return result
                })
                .catch(e => {
                  subscriptionsForUseCase.forEach(fn =>
                    fn({error: e, params, result: null})
                  )
                  return Promise.reject(e)
                })
            },
            subscribe: callback => {
              this.subscribers[key] = this.subscribers[key] || []
              this.subscribers[key].push(callback)

              // return a way to remove the listener
              return {
                unsubscribe: () => {
                  this.subscribers[key] = this.subscribers[key].filter(
                    l => l !== callback
                  )
                }
              }
            },
            $: {
              // support deprecated decorator @streamify
              execute: {
                subscribe: (onNext, onError) => {
                  // creating an object here that will have a dispose method
                  const ret = {dispose: function() {}}
                  loader().then(factory => {
                    // black magic: mutate the object, very small memory leak but that
                    // makes dispose working async and we need it
                    ret.dispose = getMethod(factory)({
                      config: this._config
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
