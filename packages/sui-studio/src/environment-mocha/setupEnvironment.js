import React from 'react'
import {render} from '@testing-library/react'

const setupEnvironment = Component => props => {
  const container = document.createElement('div')
  container.setAttribute('id', 'test-container')
  const utils = render(<Component {...props} />, {
    container: document.body.appendChild(container)
  })
  return utils
}

export const addSetupEnvironment = target => {
  if (!target.setupEnvironment) {
    target.setupEnvironment = setupEnvironment
  }
}

export default setupEnvironment
