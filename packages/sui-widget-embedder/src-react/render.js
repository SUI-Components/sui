/* eslint-disable */

import React from 'react'
import ReactDOM from 'react-dom'

export default function render(root, id = 'root') {
  if (!document.getElementById(id)) {
    const element = document.createElement('div')
    element.setAttribute('id', id)
    document.body.appendChild(element)
  }

  ReactDOM.render(<div>{root}</div>, document.getElementById(id))
}
