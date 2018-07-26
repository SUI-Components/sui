import React from 'react'
import ReactDOM from 'react-dom'

import './styles/index.scss'
import Root from './components/Root'
import {isFunction} from '../../src/components/demo/utilities'
;(async () => {
  const ctxt = await import('demo/context')
    .then(module => module.default || module)
    .catch(() => ({}))
  const contexts = isFunction(ctxt) ? await ctxt() : ctxt
  ReactDOM.render(<Root contexts={contexts} />, document.getElementById('app'))
})()
