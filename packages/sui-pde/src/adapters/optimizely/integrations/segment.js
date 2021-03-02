/**
 * From https://segment.com/docs/connections/destinations/catalog/optimizely-web/#optimizely-full-stack-javascript-sdk
 * The instance must be named optmizelyClientInstance.
 * Attach the optimizelyClientInstance to the window so Segment recognizes it.
 * @param {object} param
 * @param {object} param.activeIntegrations  check if your integration key is set to true in order to know
 *                                           if your integration should be activated
 *                                           Example {segment: true, braze: true}
 * @param {object} param.optimizelyInstance
 */
export const segment = ({
  activeIntegrations,
  optimizelyInstance,
  hasUserConsents
}) => {
  if (!activeIntegrations.segment || typeof window === 'undefined') return
  if (!hasUserConsents) {
    delete window.optimizelyClientInstance
    return
  }
  if (!window.optimizelyClientInstance) {
    window.optimizelyClientInstance = optimizelyInstance
  }
}
