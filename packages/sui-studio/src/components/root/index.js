import React, {Component} from 'react'
import {hot} from 'react-hot-loader'
import {Router, browserHistory} from 'react-router'
import routes from '../../routes'
import '../../index.scss'

class Root extends Component {
  render() {
    return <Router routes={routes} history={browserHistory} />
  }
}

export default hot(module)(Root)
