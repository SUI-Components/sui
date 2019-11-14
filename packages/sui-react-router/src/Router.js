import React from 'react'
import PropTypes from 'prop-types'

const Router = ({routes, history, children}) => {
  return children
}

Router.propTypes = {
  routes: PropTypes.object,
  history: PropTypes.object,
  children: PropTypes.object
}

export default Router
