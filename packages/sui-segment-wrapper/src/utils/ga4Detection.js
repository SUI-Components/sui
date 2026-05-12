import {getConfig} from '../config.js'

/**
 * Check if Google Analytics 4 Web destination is enabled in Segment
 * Simple detection based on googleAnalyticsMeasurementId presence:
 * - If googleAnalyticsMeasurementId is configured → LEGACY mode (manual GA4)
 * - If NOT configured → NEW mode (Segment destination handles GA4)
 * @returns {boolean}
 */
export const isGA4DestinationEnabled = () => {
  const googleAnalyticsMeasurementId = getConfig('googleAnalyticsMeasurementId')
  // If no measurement ID configured, assume they're using Segment destination
  return !googleAnalyticsMeasurementId
}

/**
 * Reset the cached detection (useful for testing)
 * @deprecated No longer needed as detection is now stateless
 */
export const resetGA4DetectionCache = () => {
  // No-op: detection is now stateless, no cache to reset
}
