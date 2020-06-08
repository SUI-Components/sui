const optimizelySDK = require('@optimizely/optimizely-sdk')

const DEFAULT_OPTIONS = {
  autoUpdate: true,
  updateInterval: 10 * 1000 // 10 seconds in milliseconds
}

const DEFAULT_TIMEOUT = 500

export default class OptimizelyAdapter {
  constructor({optimizely, userId}) {
    if (this._userId) {
      throw new Error('userId is mandatory to use OptimizelyAdapter')
    }

    if (this._optimizely) {
      throw new Error(
        'optimizely instance is mandatory to use OptimizelyAdapter'
      )
    }

    this._optimizely = optimizely
    this._userId = userId
  }

  static createOptimizelyInstance({options = DEFAULT_OPTIONS, sdkKey}) {
    optimizelySDK.setLogLevel('info')
    optimizelySDK.setLogger(optimizelySDK.logging.createLogger())

    return optimizelySDK.createInstance({
      sdkKey,
      datafileOptions: options
    })
  }

  getEnabledFeatures({attributes} = {}) {
    return this._onReady().then(optimizely =>
      optimizely.getEnabledFeatures(this._userId.toString(), attributes)
    )
  }

  _onReady() {
    return this._optimizely
      .onReady({timeout: DEFAULT_TIMEOUT})
      .then(() => this._optimizely)
  }
}
