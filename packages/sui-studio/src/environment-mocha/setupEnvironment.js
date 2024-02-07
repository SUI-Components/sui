import PropTypes from 'prop-types'

import {render} from '@testing-library/react'

const DefaultWrapper = ({children}) => <>{children}</>

DefaultWrapper.propTypes = {
  children: PropTypes.any
}

const getWrapper = ({contexts = [], wrapper: Wrapper = DefaultWrapper}) => {
  const ContextsWrapper = ({children}) =>
    contexts.reduce((children, {provider: Provider, value}) => <Provider value={value}>{children}</Provider>, children)

  const CustomWrapper = ({children}) => (
    <ContextsWrapper>
      <Wrapper>{children}</Wrapper>
    </ContextsWrapper>
  )

  CustomWrapper.propTypes = {
    children: PropTypes.any
  }

  return CustomWrapper
}

/**
 * Render a component using React Testing Library (RTL)
 * Keep RTL api
 * https://testing-library.com/docs/react-testing-library/api/#render-options
 */
const setupEnvironment =
  (Component, {contexts = [], hydrate, queries, wrapper} = {}) =>
  props => {
    const container = document.createElement('div')
    const wrapperWithContexts = getWrapper({contexts, wrapper})

    container.setAttribute('id', 'test-container')

    return render(<Component {...props} />, {
      container: document.body.appendChild(container),
      hydrate,
      queries,
      wrapper: wrapperWithContexts
    })
  }

export const addSetupEnvironment = target => {
  if (!target.setupEnvironment) {
    target.setupEnvironment = setupEnvironment
  }
}

export default setupEnvironment
