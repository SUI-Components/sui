import PropTypes from 'prop-types'

import useFeature from '../hooks/useFeature.js'

export default function Feature({
  children,
  featureKey,
  attributes,
  queryString,
  adapterId,
  shouldTrackExperimentViewed
}) {
  const {isActive, variables} = useFeature(featureKey, attributes, queryString, adapterId, shouldTrackExperimentViewed)
  return children({isActive, variables})
}

Feature.propTypes = {
  featureKey: PropTypes.string.isRequired,
  attributes: PropTypes.object,
  queryString: PropTypes.string,
  children: PropTypes.func,
  adapterId: PropTypes.string,
  shouldTrackExperimentViewed: PropTypes.bool
}
Feature.displayName = 'Feature'
