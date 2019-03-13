import React from 'react'
import {Router, browserHistory} from 'react-router'
import routes from '../../routes'
import '../../index.scss'

const Root = () => <Router routes={routes} history={browserHistory} />
export default Root
