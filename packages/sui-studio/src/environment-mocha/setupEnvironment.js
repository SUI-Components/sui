import {render} from '@testing-library/react'

const setupEnvironment = Component => props => {
  const container = document.createElement('div')
  container.setAttribute('id', 'test-container')
  return render(<Component {...props} />, {
    container: document.body.appendChild(container)
  })
}

export const addSetupEnvironment = target => {
  if (!target.setupEnvironment) {
    target.setupEnvironment = setupEnvironment
  }
}

export default setupEnvironment
