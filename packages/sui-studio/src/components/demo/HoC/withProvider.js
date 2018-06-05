import React, {Component} from 'react'
import {Provider} from '@s-ui/react-domain-connector'

const withProvider = (flag, store) => Target => {
  if (!flag) {
    return Target
  }

  class WithProvider extends Component {
    static displayName = `WithProvider(${Target.displayName})`
    static originalContextTypes =
      Target.originalContextTypes || Target.contextTypes

    render() {
      return (
        <Provider store={store}>
          <Target {...this.props} />
        </Provider>
      )
    }
  }

  return WithProvider
}

export default withProvider
