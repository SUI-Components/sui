// Returns the experiment ids linked to a feature flag. Feature Test ids.

export const getLinkedExperiments = ({config, featureKey}) => {
  return Object.keys(config.featuresMap[featureKey].experimentsMap)
}
