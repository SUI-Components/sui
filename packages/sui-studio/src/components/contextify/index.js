// Inspirated by https://github.com/babotech/react-contextify/blob/master/src/contextify.js
import React, {Component} from 'react'
import hoist from './hoist-non-react-statics'

const contextify = (types = {}, context) => (WrappedComponent) => {
  class Contextify extends Component {
    static get displayName () {
      return WrappedComponent.displayName
    }
    static get childContextTypes () {
      return types
    }

    getChildContext () {
      return context
    }

    render () {
      return (<WrappedComponent {...this.props} />)
    }
  }

  return hoist(Contextify, WrappedComponent)
}

export default contextify
