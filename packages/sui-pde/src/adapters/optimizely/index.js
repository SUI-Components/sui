import optimizelySDK from '@optimizely/optimizely-sdk'
import {updateIntegrations} from './integrations/handler'

const DEFAULT_OPTIONS = {
  autoUpdate: true,
  updateInterval: 5 * 60 * 1000, // 5 minutes
  logLevel: 'info'
}

const DEFAULT_TIMEOUT = 500

export default class OptimizelyAdapter {
  /**
   * @constructor
   * @param {object} param
   * @param {object} param.optimizely OptimizelyInstance returned by createOptimizelyInstance method
   * @param {string=} param.userId
   * @param {object} param.activeIntegrations segment activated by default
   * @param {boolean} param.hasUserConsents
   */
  constructor({
    optimizely,
    userId,
    activeIntegrations = {segment: true},
    hasUserConsents,
    applicationAttributes = {}
  }) {
    if (!optimizely) {
      throw new Error(
        'optimizely instance is mandatory to use OptimizelyAdapter'
      )
    }

    this._optimizely = optimizely
    this._userId = userId?.toString()
    this._activeIntegrations = activeIntegrations
    this._applicationAttributes = applicationAttributes
    this.updateConsents({hasUserConsents})
  }

  /**
   * @param {object} param
   * @param {string} param.sdkKey
   * @param {object=} param.datafile
   * @param {object} param.options https://docs.developers.optimizely.com/full-stack/docs/initialize-sdk-javascript-node
   * @param {object} optimizely test purposes only, optimizely sdk
   */
  static createOptimizelyInstance({
    options: optionParameter,
    sdkKey,
    datafile,
    optimizely = optimizelySDK
  }) {
    const options = {...DEFAULT_OPTIONS, ...optionParameter}
    optimizely.setLogLevel(options.logLevel)
    optimizely.setLogger(optimizely.logging.createLogger())
    if (
      !datafile &&
      typeof window !== 'undefined' &&
      window.__INITIAL_CONTEXT_VALUE__?.pde
    ) {
      datafile = window.__INITIAL_CONTEXT_VALUE__.pde
    }

    const optimizelyInstance = optimizely.createInstance({
      sdkKey,
      datafileOptions: options,
      datafile
    })

    return optimizelyInstance
  }

  /**
   * @param {object} param
   * @param {object} param.attributes
   * @return {string[]}
   */
  getEnabledFeatures({attributes}) {
    return this._optimizely.getEnabledFeatures(this._userId, attributes)
  }

  /**
   * returns the datafile, useful in a server/client scenario
   */
  getInitialData() {
    let datafile = null
    try {
      datafile = this._optimizely.getOptimizelyConfig().getDatafile()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    return datafile
  }

  /**
   * Activates an A/B test for the specified user to start an experiment: determines whether they qualify for the experiment,
   * buckets a qualified user into a variation, and sends an impression event to Optimizely.
   * More info: https://docs.developers.optimizely.com/full-stack/docs/activate-javascript-node
   * @param {Object} params
   * @param {string} params.name
   * @param {object} [params.attributes]
   * @returns {string=} variation name
   */
  activateExperiment({name, attributes}) {
    if (!this._hasUserConsents) return null
    return this._optimizely.activate(name, this._userId, {
      ...this._applicationAttributes,
      ...attributes
    })
  }

  /**
   * Gets the variation without tracking the impression
   * @param {Object} params
   * @param {string} params.name
   * @param {object} [params.attributes]
   * @returns {string=} variation name
   */
  getVariation({name, attributes}) {
    if (!this._hasUserConsents) return null
    return this._optimizely.getVariation(name, this._userId, {
      ...this._applicationAttributes,
      ...attributes
    })
  }

  onReady() {
    return this._optimizely
      .onReady({timeout: DEFAULT_TIMEOUT})
      .then(() => this._optimizely)
  }

  updateConsents({hasUserConsents}) {
    this._hasUserConsents = hasUserConsents
    updateIntegrations({
      hasUserConsents: this._hasUserConsents,
      activeIntegrations: this._activeIntegrations,
      optimizelyInstance: this._optimizely
    })
  }
}
