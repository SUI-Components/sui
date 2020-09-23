import React from 'react'
import ReactDOM from 'react-dom'
import {Router} from '@s-ui/react-router'

import routes from './routes'
import './index.scss'

ReactDOM.render(<Router routes={routes} />, document.getElementById('root'))
