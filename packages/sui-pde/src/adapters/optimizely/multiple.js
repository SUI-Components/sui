import OptimizelyAdapter from './index.js'

let defaultAdapterId

class MultipleOptimizelyAdapter {
  static createMultipleOptimizelyInstances(optionsByInstance) {
    return Object.keys(optionsByInstance).reduce((acc, adapterId) => {
      let {datafile, sdkKey, ...restOptions} = optionsByInstance[adapterId]

      if (!datafile && typeof window !== 'undefined' && window.__INITIAL_CONTEXT_VALUE__?.pde[adapterId]) {
        datafile = window.__INITIAL_CONTEXT_VALUE__.pde[adapterId]
        sdkKey = undefined
      }

      acc[adapterId] = OptimizelyAdapter.createOptimizelyInstance({
        datafile,
        sdkKey,
        ...restOptions
      })

      return acc
    }, {})
  }

  #adapters = {}

  constructor(optimizelyAdapters) {
    defaultAdapterId = Object.keys(optimizelyAdapters)[0] // first adapter will be the defaultAdapter

    this.#adapters = Object.keys(optimizelyAdapters).reduce((acc, adapterId) => {
      acc[adapterId] = new OptimizelyAdapter(optimizelyAdapters[adapterId])
      return acc
    }, {})
  }

  getInitialData() {
    const initialData = {}

    Object.keys(this.#adapters).forEach(adapterId => {
      const adapter = this.#adapters[adapterId]
      initialData[adapterId] = adapter.getInitialData()
    })

    return initialData
  }

  onReady() {
    return Promise.all(Object.values(this.#adapters).map(adapter => adapter.onReady()))
  }

  getEnabledFeatures({adapterId = defaultAdapterId, ...props}) {
    return this.#adapters[adapterId].getEnabledFeatures(props)
  }

  getOptimizelyConfig({adapterId = defaultAdapterId, ...props}) {
    return this.#adapters[adapterId].getOptimizelyConfig(props)
  }

  activateExperiment({adapterId = defaultAdapterId, ...props}) {
    return this.#adapters[adapterId].activateExperiment(props)
  }

  decide({adapterId = defaultAdapterId, ...props}) {
    return this.#adapters[adapterId].decide(props)
  }

  addDecideListener({adapterId = defaultAdapterId, ...props}) {
    return this.#adapters[adapterId].addDecideListener(props)
  }

  removeNotificationListener({adapterId = defaultAdapterId, ...props}) {
    this.#adapters[adapterId].removeNotificationListener(props)
  }

  getVariation({adapterId = defaultAdapterId, ...props}) {
    return this.#adapters[adapterId].getVariation(props)
  }

  isFeatureEnabled({adapterId = defaultAdapterId, ...props}) {
    return this.#adapters[adapterId].isFeatureEnabled(props)
  }

  getAllFeatureVariables({adapterId = defaultAdapterId, ...props}) {
    return this.#adapters[adapterId].getAllFeatureVariables(props)
  }

  updateConsents(props) {
    Object.keys(this.#adapters).forEach(adapterId => {
      const adapter = this.#adapters[adapterId]
      adapter.updateConsents(props)
    })
  }
}

export default MultipleOptimizelyAdapter
