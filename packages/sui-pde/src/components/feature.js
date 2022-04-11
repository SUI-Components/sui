import PropTypes from 'prop-types'
import useFeature from '../hooks/useFeature.js'

export default function Feature({
  children,
  featureKey,
  attributes,
  queryString
}) {
  const {isActive, variables} = useFeature(featureKey, attributes, queryString)
  return children({isActive, variables})
}

Feature.propTypes = {
  featureKey: PropTypes.string.isRequired,
  attributes: PropTypes.object,
  queryString: PropTypes.string,
  children: PropTypes.func
}
Feature.displayName = 'Feature'
