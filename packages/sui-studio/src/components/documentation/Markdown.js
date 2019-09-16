import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'

export default function Markdown({content}) {
  const [dependenciesReady, setDependenciesReady] = useState(false)
  const snarkdownRef = useRef()

  useEffect(function() {
    import('snarkdown').then(({default: snarkdown}) => {
      snarkdownRef.current = snarkdown
      setDependenciesReady(true)
    })
  })

  if (dependenciesReady === false) return null
  const {current: snarkdown} = snarkdownRef

  return (
    content && (
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{__html: snarkdown(content)}}
      />
    )
  )
}

Markdown.displayName = 'Markdown'
Markdown.propTypes = {
  content: PropTypes.string
}
