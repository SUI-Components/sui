import PropTypes from 'prop-types'

import useDecision from '../hooks/useDecision.js'

export default function Decision({adapterId, name, attributes, trackExperimentViewed, queryString, children}) {
  const data = useDecision(name, {
    attributes,
    trackExperimentViewed,
    queryString,
    adapterId
  })

  return children(data)
}

Decision.propTypes = {
  name: PropTypes.string.isRequired,
  attributes: PropTypes.object,
  trackExperimentViewed: PropTypes.func,
  queryString: PropTypes.string,
  children: PropTypes.func,
  adapterId: PropTypes.string
}
Decision.displayName = 'Decision'
