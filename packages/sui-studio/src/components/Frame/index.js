// https://github.com/c8r/kit/blob/master/core/src/Frame.js
// https://github.com/c8r/kit/blob/master/core/src/Responsive.js
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import {renderToStaticMarkup} from 'react-dom/server'

class Frame extends React.Component {
  static propTypes = {
    head: PropTypes.node,
    zoom: PropTypes.number,
    width: PropTypes.string,
    height: PropTypes.string,
    css: PropTypes.string
  }

  static defaultProps = {
    zoom: 1,
    width: '100%',
    height: '100%',
    css: ''
  }

  constructor() {
    super()

    this.doc = null
    this.win = null
    this.div = null
    this.root = React.createRef()

    this.getSrc = () => {
      const {zoom = 1, css = '', head} = this.props
      let headHTML = ''
      if (head) {
        headHTML = renderToStaticMarkup(head)
      }
      return `<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;zoom:${zoom}} ${css}</style>${headHTML}
<div id='app'></div>`
    }

    this.onLoad = e => {
      this.doc = this.root.current.contentDocument
      this.win = this.root.current.contentWindow
      this.update(this.props)
    }

    this.update = ({render, children}) => {
      if (!this.doc) return
      const div = this.doc.getElementById('app')
      if (typeof render === 'function') {
        ReactDOM.render(
          render({
            document: this.doc,
            window: this.win
          }),
          div
        )
      } else {
        ReactDOM.render(children, div)
      }
    }
  }

  render() {
    const {width, height, zoom} = this.props

    return (
      <iframe
        ref={this.root}
        style={{
          position: 'absolute',
          width,
          height,
          zoom,
          display: 'block',
          margin: 0,
          overflow: 'scroll',
          backgroundColor: '#fff',
          border: 0
        }}
        srcDoc={this.getSrc()}
        scrolling="yes"
        onLoad={this.onLoad}
      />
    )
  }
}

export default Frame
