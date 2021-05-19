import DefaultAdapter from './adapters/default'

export default class PDE {
  /**
   * @constructor
   * @param {object} param
   * @param {object} param.adapter
   * @param {boolean} param.hasUserConsents
   */
  constructor({adapter, hasUserConsents = true} = {}) {
    if (!adapter) {
      adapter = new DefaultAdapter()
    }
    this._adapter = adapter
    this._adapter.updateConsents({hasUserConsents})
  }

  getEnabledFeatures({attributes} = {}) {
    return this._adapter.getEnabledFeatures({attributes})
  }

  /**
   * @param {object} param
   * @param {string} param.name
   * @param {object} param.attributes
   */
  activateExperiment({name, attributes}) {
    return this._adapter.activateExperiment({name, attributes})
  }

  getInitialData() {
    return this._adapter.getInitialData()
  }

  /**
   * @param {object} param
   * @param {string} param.name
   * @param {object} param.attributes
   */
  getVariation({name, attributes}) {
    return this._adapter.getVariation({name, attributes})
  }

  /**
   * Checks if a feature flag is active or not
   * @param {object} param
   * @param {string} param.featureKey Feature flag key
   * @parma {object=} param.attributes
   * @returns {boolean}
   */
  isFeatureEnabled({featureKey, attributes}) {
    return this._adapter.isFeatureEnabled({featureKey, attributes})
  }
}
