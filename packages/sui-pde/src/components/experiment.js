import PropTypes from 'prop-types'
import useExperiment from '../hooks/useExperiment.js'

export default function Experiment({
  experimentName,
  attributes,
  trackExperimentViewed,
  queryString,
  children
}) {
  const {variation} = useExperiment({
    experimentName,
    attributes,
    trackExperimentViewed,
    queryString
  })

  return children({variation})
}

Experiment.propTypes = {
  experimentName: PropTypes.string.isRequired,
  attributes: PropTypes.object,
  trackExperimentViewed: PropTypes.func,
  queryString: PropTypes.string,
  children: PropTypes.func
}
Experiment.displayName = 'Experiment'
