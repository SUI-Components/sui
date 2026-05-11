/**
 * Check if Google Analytics 4 Web destination is enabled in Segment
 * @returns {boolean}
 */
export const isGA4DestinationEnabled = () => {
  try {
    // Check if the destination is configured in Segment settings
    const integrations = window.analytics?.settings?.cdnSettings?.integrations
    if (!integrations || typeof integrations !== 'object') return false

    // Look for 'Google Analytics 4 Web' in the integrations object
    return Object.keys(integrations).some(
      key => key === 'Google Analytics 4 Web' || integrations[key]?.name === 'Google Analytics 4 Web'
    )
  } catch (error) {
    return false
  }
}
