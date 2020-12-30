import SUIContext from '@s-ui/react-context'
import {render} from '@testing-library/react'

const setupEnvironment = (Component, context) => props => {
  const container = document.createElement('div')
  container.setAttribute('id', 'test-container')
  return render(
    context ? (
      <SUIContext.Provider value={context}>
        <Component {...props} />
      </SUIContext.Provider>
    ) : (
      <Component {...props} />
    ),
    {
      container: document.body.appendChild(container)
    }
  )
}

export const addSetupEnvironment = target => {
  if (!target.setupEnvironment) {
    target.setupEnvironment = setupEnvironment
  }
}

export default setupEnvironment
