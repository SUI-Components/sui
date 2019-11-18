import PropTypes from 'prop-types'
import {routes} from './InternalPropTypes'

const Router = ({routes, history, children}) => {
  return children
}

Router.displayName = 'Router'
Router.propTypes = {
  children: routes,
  history: PropTypes.object,
  routes
}

export default Router
