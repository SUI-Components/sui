// Functions needed in order to make the integration between optimizely and a third party work

/**
 * From https://segment.com/docs/connections/destinations/catalog/optimizely-web/#optimizely-full-stack-javascript-sdk
 * The instance must be named optmizelyClientInstance.
 * Attach the optimizelyClientInstance to the window so Segment recognizes it.
 * @param {object} param
 * @param {object} param.activeIntegrations
 * @param {object} param.optimizelyInstance
 */
const segment = ({activeIntegrations, optimizelyInstance}) => {
  if (
    activeIntegrations.segment &&
    typeof window !== 'undefined' &&
    !window.optimizelyClientInstance
  ) {
    window.optimizelyClientInstance = optimizelyInstance
  }
}

export default [segment]
