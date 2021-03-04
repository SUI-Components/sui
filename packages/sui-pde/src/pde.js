import DefaultAdapter from './adapters/default'

export default class PDE {
  /**
   * @constructor
   * @param {object} param
   * @param {object} param.adapter
   * @param {boolean} param.hasUserConsents
   */
  constructor({adapter, hasUserConsents = true} = {}) {
    if (!adapter || !hasUserConsents) {
      adapter = new DefaultAdapter()
    }
    this._adapter = adapter
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
}
