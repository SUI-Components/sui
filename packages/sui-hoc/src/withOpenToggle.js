import React, {Component} from 'react'

export default BaseComponent => {
  const displayName = BaseComponent.displayName

  return class WithOpenToggle extends Component {
    static displayName = `WithOpenToggle(${displayName})`

    state = {
      open: false
    }

    handleToggle = (_, {open} = {}) => {
      this.setState(prevState => ({
        open: open !== undefined ? open : !prevState.open
      }))
    }

    render() {
      return (
        <BaseComponent
          {...this.props}
          isOpen={this.state.open}
          onToggle={this.handleToggle}
        />
      )
    }
  }
}
