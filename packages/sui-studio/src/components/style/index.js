import PropTypes from 'prop-types'
import {Component} from 'react'

const createLinkElement = () => {
  const linkElement = document.createElement('link')
  const head = document.head || document.getElementsByTagName('head')[0]
  linkElement.rel = 'stylesheet'
  head.appendChild(linkElement)
  return linkElement
}

export default class Style extends Component {
  static propTypes = {
    children: PropTypes.string
  }

  _linkElement = createLinkElement()

  componentWillUnmount() {
    this._linkElement.disabled = true
  }

  render() {
    // https://github.com/webpack-contrib/style-loader/blob/master/lib/addStyles.js
    const blob = new window.Blob([this.props.children], {type: 'text/css'})
    const oldSrc = this._linkElement.href
    this._linkElement.href = window.URL.createObjectURL(blob)
    oldSrc && window.URL.createObjectURL(blob)

    return null
  }
}
