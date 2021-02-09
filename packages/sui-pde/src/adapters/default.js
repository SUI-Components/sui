export default class DefaultAdapter {
  getEnabledFeatures({attributes}) {
    return Promise.resolve([])
  }

  getInitialData() {
    return null
  }

  activateExperiment({name}) {
    return 'default'
  }
}
