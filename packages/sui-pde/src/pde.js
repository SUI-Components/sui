import DefaultAdapter from './adapters/default.js'

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

  getEnabledFeatures({attributes, adapterId} = {}) {
    return this._adapter.getEnabledFeatures({attributes, adapterId})
  }

  /**
   * @param {object} param
   * @param {string} param.name
   * @param {object} param.attributes
   */
  activateExperiment({name, attributes, adapterId}) {
    return this._adapter.activateExperiment({name, attributes, adapterId})
  }

  /**
   * @param {object} param
   * @param {string} param.name
   * @param {object} param.attributes
   */
  decide({name, attributes, adapterId}) {
    return this._adapter.decide({name, attributes, adapterId})
  }

  /**
   * @param {Object} params
   * @param {function} params.onDecide
   * @returns {string} notificationId
   */
  addDecideListener({onDecide}) {
    return this._adapter.addDecideListener({onDecide})
  }

  /**
   * @param {Object} params
   * @param {number} params.notificationId
   */
  removeNotificationListener({notificationId}) {
    this._adapter.removeNotificationListener({notificationId})
  }

  getInitialData() {
    return this._adapter.getInitialData()
  }

  /**
   * @param {object} param
   * @param {string} param.name
   * @param {object} param.attributes
   */
  getVariation({name, attributes, adapterId}) {
    return this._adapter.getVariation({name, attributes, adapterId})
  }

  /**
   * Checks if a feature flag is active or not
   * @param {object} param
   * @param {string} param.featureKey Feature flag key
   * @parma {object=} param.attributes
   * @returns {boolean}
   */
  isFeatureEnabled({featureKey, attributes, adapterId}) {
    return this._adapter.isFeatureEnabled({
      featureKey,
      attributes,
      adapterId
    })
  }

  /**
   * Return all variables of a given feature
   * @param {object} param
   * @param {string} param.featureKey Feature flag key
   * @parma {object=} param.attributes
   * @returns {object}
   */
  getAllFeatureVariables({featureKey, attributes, adapterId}) {
    return this._adapter.getAllFeatureVariables({
      featureKey,
      attributes,
      adapterId
    })
  }
}
