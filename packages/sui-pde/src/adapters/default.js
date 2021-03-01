export default class DefaultAdapter {
  getEnabledFeatures({attributes}) {
    return Promise.resolve([])
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
}
