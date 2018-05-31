import React, {Component} from 'react'
import {Router, browserHistory} from 'react-router'
import routes from '../../routes'
import '../../index.scss'

export default class Root extends Component {
  render() {
    return <Router routes={routes} history={browserHistory} />
  }
}
