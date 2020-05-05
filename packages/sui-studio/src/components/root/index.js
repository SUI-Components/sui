import React from 'react'
import {Router, browserHistory} from 'react-router'
import routes from '../../routes'
import '../../index.scss'

export default () => <Router routes={routes} history={browserHistory} />
