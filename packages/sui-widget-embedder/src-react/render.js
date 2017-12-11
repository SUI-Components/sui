import React from 'react'
import ReactDOM from 'react-dom'

const rootElement = document.createElement('div')
rootElement.setAttribute('id', 'root')
document.body.appendChild(rootElement)

export default function render (root) {
  ReactDOM.render(<div>{root}</div>, document.querySelector('#root'))
}
