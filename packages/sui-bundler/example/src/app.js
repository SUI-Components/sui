/* eslint-disable no-console */
import React from 'react'
import ReactDOM from 'react-dom'
import Hello from './hello'

// eslint-next-disable-line
import(/* webpackChunkName: "my-chunk-name" */ './foo').then(a =>
  console.log('loaded async chunk')
)

const render = Component =>
  ReactDOM.render(<Component />, document.getElementById('root'))

render(Hello)
