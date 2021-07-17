import {createElement} from 'react'
import {render} from '@testing-library/react'

const setupEnvironment = Component => props => {
  const container = document.createElement('div')
  container.setAttribute('id', 'test-container')
  return render(createElement(Component, ...props), {
    container: document.body.appendChild(container)
  })
}

export default setupEnvironment
