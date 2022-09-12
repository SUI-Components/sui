import {Component} from 'react'

import PropTypes from 'prop-types'

export default BaseComponent => {
  const displayName = BaseComponent.displayName

  return class WithOpenToggle extends Component {
    state = {
      isOpen: Boolean(this.props.isOpen)
    }

    static displayName = `WithOpenToggle(${displayName})`

    static propTypes = {
      /** isOpen */
      isOpen: PropTypes.bool
    }

    handleToggle = (_, {isOpen} = {}) => {
      this.setState(prevState => ({
        isOpen: isOpen !== undefined ? isOpen : !prevState.isOpen
      }))
    }

    render() {
      const {handleToggle, props} = this
      const {isOpen} = this.state
      return (
        <BaseComponent {...props} isOpen={isOpen} onToggle={handleToggle} />
      )
    }
  }
}
