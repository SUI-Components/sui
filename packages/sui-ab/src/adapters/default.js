module.exports = class DefaultAdapter {
  getEnabledFeatures({attributes, userId}) {
    return Promise.resolve([])
  }
}
