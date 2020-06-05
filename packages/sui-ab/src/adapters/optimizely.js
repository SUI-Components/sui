const optimizelySDK = require('@optimizely/optimizely-sdk')

const DEFAULT_OPTIONS = {
  autoUpdate: true,
  updateInterval: 10 * 1000 // 10 seconds in milliseconds
}

const DEFAULT_TIMEOUT = 500

module.exports = class OptimizelyAdapter {
  constructor({sdkKey, options = DEFAULT_OPTIONS}) {
    optimizelySDK.setLogLevel('info')
    optimizelySDK.setLogger(optimizelySDK.logging.createLogger())

    this._instance = optimizelySDK.createInstance({
      sdkKey,
      datafileOptions: options
    })
  }

  getEnabledFeatures({attributes, userId}) {
    return this._onReady().then(instance =>
      instance.getEnabledFeatures(userId.toString(), attributes)
    )
  }

  _onReady() {
    return this._instance
      .onReady({timeout: DEFAULT_TIMEOUT})
      .then(() => this._instance)
  }
}
