import PropTypes from 'prop-types'
import useFeature from '../hooks/useFeature'

export default function Feature({
  children,
  featureKey,
  attributes,
  queryString
}) {
  const value = useFeature(featureKey, attributes, queryString)
  return children(value)
}

Feature.propTypes = {
  featureKey: PropTypes.string.isRequired,
  attributes: PropTypes.object,
  queryString: PropTypes.string,
  children: PropTypes.func
}
Feature.displayName = 'Feature'
