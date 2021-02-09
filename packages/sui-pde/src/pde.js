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
   */
  activateExperiment({name}) {
    return this._adapter.activateExperiment({name})
  }

  getInitialData() {
    return this._adapter.getInitialData()
  }
}
