import PropTypes from 'prop-types'
import useExperiment from '../hooks/useExperiment'

export default function Experiment({
  experimentName,
  attributes,
  trackExperimentViewed,
  queryString,
  children
}) {
  const value = useExperiment({
    experimentName,
    attributes,
    trackExperimentViewed,
    queryString
  })

  return children(value)
}

Experiment.propTypes = {
  experimentName: PropTypes.string.isRequired,
  attributes: PropTypes.object,
  trackExperimentViewed: PropTypes.func,
  queryString: PropTypes.string,
  children: PropTypes.func
}
Experiment.displayName = 'Experiment'
