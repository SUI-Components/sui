import {Component, PropTypes} from 'react'

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

  constructor (props, ctxt) {
    super(props, ctxt)

    this._linkElement = createLinkElement()
  }

  render () {
    // https://github.com/webpack-contrib/style-loader/blob/master/addStyles.js#L238
    const blob = new window.Blob([this.props.children], {type: 'text/css'})
    const oldSrc = this._linkElement.href
    this._linkElement.href = window.URL.createObjectURL(blob)
    oldSrc && window.URL.createObjectURL(blob)

    return null
  }
}
