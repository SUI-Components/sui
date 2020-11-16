export default class DefaultAdapter {
  getEnabledFeatures({attributes}) {
    return Promise.resolve([])
  }

  activateExperiment({name}) {
    return 'default'
  }
}
