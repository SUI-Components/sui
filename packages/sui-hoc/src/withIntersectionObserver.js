/* global IntersectionObserver */
import React, {Component} from 'react'

const shouldLoadIntersectionObserver = () =>
  !('IntersectionObserver' in window) ||
  !('IntersectionObserverEntry' in window) ||
  !('intersectionRatio' in window.IntersectionObserverEntry.prototype)

export const hocIntersectionObserverWithOptions = (
  options = {}
) => BaseComponent => {
  const displayName = BaseComponent.displayName

  return class WithIntersectionObserver extends Component {
    static displayName = `withIntersectionObserver(${displayName})`
    static contextTypes = BaseComponent.contextTypes

    state = {
      isIntersecting: true
    }

    handleChange = ([{isIntersecting}]) => {
      this.setState({isIntersecting})
    }

    innerRef = elem => {
      this.refTarget = elem
    }

    async componentDidMount() {
      const target = this.refTarget
      if (shouldLoadIntersectionObserver()) {
        await import(
          /* webpackChunkName: "intersection-observer" */ 'intersection-observer'
        )
      }
      new IntersectionObserver(this.handleChange).observe(target, options)
    }

    render() {
      const {isIntersecting: isVisible} = this.state
      return (
        <BaseComponent
          {...this.props}
          isVisible={isVisible}
          innerRef={this.innerRef}
        />
      )
    }
  }
}

export default hocIntersectionObserverWithOptions()
