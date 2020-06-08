import DefaultAdapter from './adapters/default'

export default class AB {
  constructor({adapter = new DefaultAdapter()} = {}) {
    this._adapter = adapter
  }

  getEnabledFeatures({attributes} = {}) {
    return this._adapter.getEnabledFeatures({attributes})
  }
}

/**
 * Provider
 * -> userId
 *
 * Consumer
 * const {isEnabled: isParrillaMapaEnabled} = useFeature({ featureKey: 'parrilla_mapa' })
 */
