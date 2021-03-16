import {render} from 'react-dom'
import {Router} from '@s-ui/react-router'

import {importGlobals} from './components/tryRequire'
import routes from './routes'
import './index.scss'

importGlobals().then(() => {
  render(<Router routes={routes} />, document.getElementById('root'))
})
