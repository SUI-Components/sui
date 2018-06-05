import React, {Component} from 'react'

const withContext = (flag, context) => Target => {
  if (!flag) {
    return Target
  }

  class Contextify extends Component {
    static displayName = `Contextify(${Target.displayName})`
    static originalContextTypes =
      Target.originalContextTypes || Target.contextTypes
    static get childContextTypes() {
      return Target.originalContextTypes || Target.contextTypes
    }

    getChildContext() {
      return context
    }

    render() {
      return <Target {...this.props} />
    }
  }

  return Contextify
}

export default withContext
