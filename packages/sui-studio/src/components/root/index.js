import React from 'react'
import {Router, browserHistory} from 'react-router'
import routes from '../../routes'
import '../../index.scss'

export default class Root extends React.Component {
  render () {
    return <Router routes={routes} history={browserHistory} />
  }
}
