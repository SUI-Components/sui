import PropTypes from 'prop-types'
import useExperiment from '../hooks/useExperiment'

export default function Experiment({children, ...props}) {
  const value = useExperiment(props)
  return children(value)
}

Experiment.propTypes = {
  experimentName: PropTypes.string,
  attributes: PropTypes.object,
  trackExperimentViewed: PropTypes.func,
  queryString: PropTypes.string,
  children: PropTypes.func
}
Experiment.displayName = 'Experiment'
