import {render} from 'react-dom'

import {Router} from '@s-ui/react-router'

import {importGlobals} from './components/tryRequire.js'
import routes from './routes.js'

import './index.scss'

importGlobals().then(() => {
  render(<Router routes={routes} />, document.getElementById('root'))
})
