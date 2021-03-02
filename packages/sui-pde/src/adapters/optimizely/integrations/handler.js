import {segment as segmentIntegration} from './segment'

/**
 * Add to this array any integration between optimizely and a third party
 * It's expected to be an object with an initialize and a delete function
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
