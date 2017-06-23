import React, { Component, PropTypes } from 'react'
import cx from 'classnames'

// load needed scripts and styles for codemirror
import Codemirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

const CODE_MIRROR_OPTIONS = {
  lineNumbers: true,
  mode: 'javascript',
  theme: 'material'
}

export default class CodeEditor extends Component {
  render () {
    const { isOpen, onChange, playground } = this.props

    const codeClassName = cx('sui-StudioDemo-code', {
      'sui-StudioDemo-code--open': isOpen
    })

    return (
      <div className={codeClassName}>
        <Codemirror
          onChange={onChange}
          options={CODE_MIRROR_OPTIONS}
          value={playground}
        />
      </div>
    )
  }
}

CodeEditor.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  playground: PropTypes.string
}
