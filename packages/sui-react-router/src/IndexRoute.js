import PropTypes from 'prop-types'

const IndexRoute = ({component, path, getComponent, children}) => {
  return children
}

IndexRoute.displayName = 'IndexRoute'
IndexRoute.propTypes = {
  children: PropTypes.object,
  component: PropTypes.object,
  getComponent: PropTypes.func,
  path: PropTypes.string
}

export default IndexRoute

