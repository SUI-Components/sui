import DefaultAdapter from './adapters/default'

export default class PDE {
  constructor({adapter = new DefaultAdapter()} = {}) {
    this._adapter = adapter
  }

  getEnabledFeatures({attributes} = {}) {
    return this._adapter.getEnabledFeatures({attributes})
  }

  activateExperiment({name}) {
    return this._adapter.activateExperiment({name})
  }

  trackExperiment({name}) {
    return this._adapter.trackExperiment({name})
  }
}
