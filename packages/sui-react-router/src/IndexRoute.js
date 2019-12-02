import PropTypes from 'prop-types'
import invariant from 'invariant'

const IndexRoute = ({component, path, getComponent, children}) => {
  invariant(
    false,
    '<IndexRoute> elements are for router configuration only and should not be rendered'
  )
}

IndexRoute.displayName = 'IndexRoute'
IndexRoute.propTypes = {
  children: PropTypes.object,
  component: PropTypes.object,
  getComponent: PropTypes.func,
  path: PropTypes.string
}

export default IndexRoute
