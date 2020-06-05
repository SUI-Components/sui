const DefaultAdapter = require('./adapters/default')

module.exports = class AB {
  constructor({adapter = new DefaultAdapter()} = {}) {
    this._adapter = adapter
  }

  getEnabledFeatures({attributes, userId}) {
    return this._adapter.getEnabledFeatures({attributes, userId})
  }
}
