import {render} from 'react-dom'
import {Router} from '@s-ui/react-router'

import routes from './routes'
import './index.scss'

render(<Router routes={routes} />, document.getElementById('root'))
