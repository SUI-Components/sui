/* eslint-disable no-console */
import {render} from 'react-dom'

import Hello from './hello.js'

// eslint-next-disable-line
import(/* webpackChunkName: "my-chunk-name" */ './foo.js').then(({default: foo}) => {
  console.log('loaded async chunk')
  foo()
})

render(<Hello />, document.getElementById('root'))
