import React, {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import debounce from 'just-debounce-it'

import {fromTextArea} from 'codemirror'
import 'codemirror/mode/javascript/javascript'

const CODE_MIRROR_OPTIONS = {
  lineNumbers: true,
  mode: 'javascript',
  theme: 'material'
}
const DEBOUNCE_TIME = 500

function CodeEditor({isOpen, onChange, playground}) {
  const textAreaRef = useRef()

  const createOnChangeDebounced = () => {
    return debounce((codeMirrorDocument, change) => {
      if (change !== 'setValue') {
        onChange(codeMirrorDocument.getValue())
      }
    }, DEBOUNCE_TIME)
  }

  useEffect(function() {
    const onChangeDebounced = createOnChangeDebounced()
    const codeMirror = fromTextArea(textAreaRef.current, CODE_MIRROR_OPTIONS)
    codeMirror.setValue(playground)
    codeMirror.on('change', onChangeDebounced)

    return () => codeMirror.off('change', onChangeDebounced)
  }, []) // eslint-disable-line

  const codeClassName = cx('sui-StudioDemo-code', {
    'sui-StudioDemo-code--open': isOpen
  })

  return (
    <div className={codeClassName}>
      <textarea autoComplete="off" ref={textAreaRef} />
    </div>
  )
}

CodeEditor.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  playground: PropTypes.string
}

export default React.memo(CodeEditor)
