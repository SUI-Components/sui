export default class DefaultAdapter {
  getEnabledFeatures({attributes}) {
    return []
  }

  getInitialData() {
    return null
  }

  activateExperiment() {
    return null
  }

  getVariation() {
    return null
  }

  updateConsents() {
    return null
  }

  async onReady() {
    return true
  }

  isFeatureEnabled() {
    return false
  }
}
