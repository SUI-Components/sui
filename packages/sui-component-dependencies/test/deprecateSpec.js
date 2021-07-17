/* eslint-env mocha */
import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import PropTypes from 'prop-types'

import setupEnvironment from '../src/setupEnvironment'
import deprecate from '../src/deprecate'

chai.use(sinonChai)

describe('@s-ui/component-dependencies', () => {
  describe('deprecate', () => {
    const Component = ({int}) => <div>{int}</div>
    const setup = setupEnvironment(Component)
    let spyDeprecate
    let spyCallback

    beforeEach(() => {
      spyDeprecate = sinon.spy(deprecate)
      spyCallback = sinon.spy()
    })

    afterEach(() => {})

    it('deprecate should be called once', () => {
      // Given
      Component.propTypes = {
        int: spyDeprecate(PropTypes.number)
      }

      // When
      setup({int: undefined})

      // Then
      expect(spyDeprecate).to.have.callCount(1)
    })

    it('deprecate callback should NOT be called when NO given prop value', () => {
      // Given
      Component.propTypes = {
        int: spyDeprecate(PropTypes.number, spyCallback)
      }

      // When
      setup({int: undefined})

      // Then
      expect(spyDeprecate).to.have.callCount(1)
      expect(spyCallback).to.have.callCount(0)
    })

    it('deprecate callback should be called once when giving prop value', () => {
      // Given
      Component.propTypes = {
        int: spyDeprecate(PropTypes.number, spyCallback())
      }

      // When
      setup({int: 1})

      // Then
      expect(spyDeprecate).to.have.callCount(1)
      expect(spyCallback).to.have.callCount(1)
    })

    it('deprecate callback should NOT be called once when defining required prop value', () => {
      // Given
      Component.propTypes = {
        int: spyDeprecate(PropTypes.number.isRequired, spyCallback)
      }

      // When
      setup({})

      // Then
      expect(spyDeprecate).to.have.callCount(1)
      expect(spyCallback).to.have.callCount(0)
    })
  })
})
