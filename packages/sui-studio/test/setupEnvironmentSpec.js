/* eslint react/prop-types:0 */
import {createContext, useContext} from 'react'

import {use, expect} from 'chai'
import chaiDOM from 'chai-dom'

import setupEnvironment from '../src/environment-mocha/setupEnvironment.js'

use(chaiDOM)

describe('setupEnvironment', () => {
  describe('Default', () => {
    const SimpleComponent = ({text}) => {
      return <p>{text}</p>
    }

    const setup = setupEnvironment(SimpleComponent)

    it('Can render a component', () => {
      // Given
      const defaultProps = {
        text: 'Example'
      }

      // When
      const {getByText} = setup(defaultProps)

      // Then
      expect(getByText('Example')).to.be.visible
    })
  })

  describe('With contexts', () => {
    const ThemeContext = createContext('light')
    const ComponentWithContext = () => {
      const value = useContext(ThemeContext)
      return <p>{value}</p>
    }
    const setup = setupEnvironment(ComponentWithContext, {
      contexts: [
        {
          provider: ThemeContext.Provider,
          value: 'dark'
        }
      ]
    })

    it('Can render a component', () => {
      // Given
      const defaultProps = {}

      // When
      const {getByText} = setup(defaultProps)

      // Then
      expect(getByText('dark')).to.be.visible
    })
  })

  describe('With wrapper', () => {
    const Component = () => {
      return <p>Example</p>
    }
    const setup = setupEnvironment(Component, {
      wrapper: ({children}) => (
        <div>
          <p>Hello</p>
          {children}
        </div>
      )
    })

    it('Can render a component', () => {
      // Given
      const defaultProps = {}

      // When
      const {getByText} = setup(defaultProps, {})

      // Then
      expect(getByText('Hello')).to.be.visible
      expect(getByText('Example')).to.be.visible
    })
  })

  describe('With wrapper and contexts', () => {
    const ThemeContext = createContext('light')
    const ComponentWithContext = () => {
      const value = useContext(ThemeContext)
      return <p>{value}</p>
    }
    const setup = setupEnvironment(ComponentWithContext, {
      contexts: [
        {
          provider: ThemeContext.Provider,
          value: 'dark'
        }
      ],
      wrapper: ({children}) => (
        <div>
          <p>Hello</p>
          {children}
        </div>
      )
    })

    it('Can render a component', () => {
      // Given
      const defaultProps = {}

      // When
      const {getByText} = setup(defaultProps)

      // Then
      expect(getByText('Hello')).to.be.visible
      expect(getByText('dark')).to.be.visible
    })
  })
})
