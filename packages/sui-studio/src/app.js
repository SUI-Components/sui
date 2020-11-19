import {render} from 'react-dom'
import {Router} from '@s-ui/react-router'

import {importGobals} from './components/tryRequire'
import routes from './routes'
import './index.scss'

importGobals().then(() => {
  render(<Router routes={routes} />, document.getElementById('root'))
})
