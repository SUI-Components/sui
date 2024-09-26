import optimizelySDK from '@optimizely/optimizely-sdk'

import {updateIntegrations} from './integrations/handler.js'

const DEFAULT_DATAFILE_OPTIONS = {
  autoUpdate: true,
  updateInterval: 5 * 60 * 1000 // 5 minutes
}

const DEFAULT_EVENTS_OPTIONS = {
  eventBatchSize: 10,
  eventFlushInterval: 1000
}

const DEFAULT_TIMEOUT = 500

const {enums: LOG_LEVEL} = optimizelySDK

const LOGGER_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVEL.error : LOG_LEVEL.info

export default class OptimizelyAdapter {
  /**
   * @constructor
   * @param {object} param
   * @param {object} param.optimizely OptimizelyInstance returned by createOptimizelyInstance method
   * @param {string=} param.userId
   * @param {object} param.activeIntegrations segment activated by default
   * @param {boolean} param.hasUserConsents
   */
  constructor({optimizely, userId, activeIntegrations = {segment: true}, hasUserConsents, applicationAttributes = {}}) {
    if (!optimizely) {
      throw new Error('optimizely instance is mandatory to use OptimizelyAdapter')
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
   * @param {object} param.options datafile options https://docs.developers.optimizely.com/full-stack/docs/initialize-sdk-javascript-node
   * @param {object} param.optimizely test purposes only, optimizely sdk
   * @param {function} param.eventDispatcher https://docs.developers.optimizely.com/full-stack/docs/configure-event-dispatcher-javascript-node
   */
  static createOptimizelyInstance({
    options: optionParameter,
    sdkKey,
    datafile,
    optimizely = optimizelySDK,
    eventDispatcher = optimizelySDK.eventDispatcher
  }) {
    const options = {...DEFAULT_DATAFILE_OPTIONS, ...optionParameter}
    optimizely.setLogLevel(LOGGER_LEVEL)
    optimizely.setLogger(optimizely.logging.createLogger())
    if (!datafile && typeof window !== 'undefined' && window.__INITIAL_CONTEXT_VALUE__?.pde) {
      datafile = window.__INITIAL_CONTEXT_VALUE__.pde
      sdkKey = undefined
    }

    const isServer = typeof window === 'undefined'
    const optimizelyInstance = optimizely.createInstance({
      sdkKey,
      datafileOptions: options,
      datafile,
      eventDispatcher,
      ...DEFAULT_EVENTS_OPTIONS,
      defaultDecideOptions: isServer ? [optimizely.OptimizelyDecideOption.DISABLE_DECISION_EVENT] : []
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
      datafile = this.getOptimizelyConfig().getDatafile()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    return datafile
  }

  getOptimizelyConfig() {
    return this._optimizely.getOptimizelyConfig()
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
   * @param {Object} params
   * @param {string} params.name
   * @param {object} [params.attributes]
   * @returns {string=} variation name
   */
  decide({name, attributes}) {
    if (!this._hasUserConsents) return null

    const user = this._optimizely.createUserContext(this._userId, {
      ...this._applicationAttributes,
      ...attributes
    })

    return user.decide(name)
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
    return this._optimizely.onReady({timeout: DEFAULT_TIMEOUT}).then(() => this._optimizely)
  }

  /**
   * Checks if a feature flag is active or not
   * @param {object} param
   * @param {string} param.featureKey
   * @parma {object=} param.attributes
   * @returns {isActive: boolean, linkedExperiments: number[]}
   */
  isFeatureEnabled({featureKey, attributes}) {
    const experimentsMap = this.getOptimizelyConfig()?.featuresMap[featureKey]?.experimentsMap || {}
    const linkedExperimentNames = Object.keys(experimentsMap)

    // check for user consents only if featureKey is a feature that belongs to a feature test or if a userId is available
    if ((linkedExperimentNames.length > 0 && !this._hasUserConsents) || !this._userId) {
      return {isActive: false, linkedExperiments: []}
    }

    return {
      isActive: this._optimizely.isFeatureEnabled(featureKey, this._userId, {
        ...this._applicationAttributes,
        ...attributes
      }),
      linkedExperiments: linkedExperimentNames
    }
  }

  /**
   * Return all variables of a given feature
   * @param {object} param
   * @param {string} param.featureKey
   * @parma {object=} param.attributes
   * @returns {object}
   */
  getAllFeatureVariables({featureKey, attributes}) {
    return this._optimizely.getAllFeatureVariables(featureKey, this._userId, attributes)
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
