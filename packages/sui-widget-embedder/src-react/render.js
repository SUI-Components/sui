import React from 'react'
import ReactDOM from 'react-dom'

document.body.innerHTML += '<div id="root"></div>'
export default function render (root) {
  ReactDOM.render(<div>{root}</div>, document.querySelector('#root'))
}
