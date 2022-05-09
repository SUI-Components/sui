import {segment as segmentIntegration} from './segment.js'

/**
 * Add to this array any integration between optimizely and a third party
 */
const integrations = [segmentIntegration]

/**
 * Will run through all integrations and call them
 * @param {object} param
 * @param {boolean} param.hasUserConsents
 * @param {object} param.activeIntegrations
 * @param {object} param.optimizelyInstance
 */
export const updateIntegrations = ({
  hasUserConsents,
  activeIntegrations,
  optimizelyInstance
}) => {
  integrations.forEach(integration =>
    integration({
      activeIntegrations,
      optimizelyInstance,
      hasUserConsents
    })
  )
}
