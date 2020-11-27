import React, {Component} from 'react'

export default BaseComponent => {
  const displayName = BaseComponent.displayName

  return class WithOpenToggle extends Component {
    state = {
      isOpen: Boolean(this.props.isOpen) // eslint-disable-line
    }

    static displayName = `WithOpenToggle(${displayName})`

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
