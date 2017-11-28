
import required from './helpers/required'

export default class EntryPoint {
  constructor ({ config = required('config'), useCases = require('useCases') }) {
    this._config = config
    this._useCases = useCases
  }

  get (key) {
    if (key === 'config') {
      return this._config
    }

    return this._useCases[key] || {
      execute: () => Promise.reject(new Error(`[EntryPoint#get] ${key} not defined`))
    }
  }

  config (key, value) {
    this._config.set(key, value)
    return this
  }
}
