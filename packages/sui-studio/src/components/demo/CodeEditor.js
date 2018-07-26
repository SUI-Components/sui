import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import cx from 'classnames'
import debounce from 'just-debounce-it'

// load needed scripts and styles for codemirror
import CodeMirror from 'codemirror'
require('codemirror/mode/javascript/javascript')

const CODE_MIRROR_OPTIONS = {
  lineNumbers: true,
  mode: 'javascript',
  theme: 'material'
}
const DEBOUNCE_TIME = 500

export default class CodeEditor extends PureComponent {
  _createOnChangeDebounced = () => {
    return debounce((codeMirrorDocument, change) => {
      if (change !== 'setValue') {
        this.props.onChange(codeMirrorDocument.getValue())
      }
    }, DEBOUNCE_TIME)
  }

  componentDidMount() {
    this._createOnChangeDebouncedFn = this._createOnChangeDebounced()
    this.codeMirror = CodeMirror.fromTextArea(
      this.textareaNode,
      CODE_MIRROR_OPTIONS
    )
    this.codeMirror.setValue(this.props.playground)
    this.codeMirror.on('change', this._createOnChangeDebouncedFn)
  }

  componentWillUnmount() {
    this.codeMirror.off('change', this._createOnChangeDebouncedFn)
  }

  render() {
    const {isOpen} = this.props

    const codeClassName = cx('sui-StudioDemo-code', {
      'sui-StudioDemo-code--open': isOpen
    })

    return (
      <div className={codeClassName}>
        <textarea
          autoComplete="off"
          ref={ref => {
            this.textareaNode = ref
          }}
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
