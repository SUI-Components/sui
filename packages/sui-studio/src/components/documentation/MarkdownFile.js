import {useEffect, useState} from 'react'

import PropTypes from 'prop-types'

import {fetchMarkdownFile} from '../tryRequire.js'
import Markdown from './Markdown.js'

export default function MarkdownFile({file, params}) {
  const [content, setContent] = useState(null)

  useEffect(
    function () {
      const {category, component} = params
      fetchMarkdownFile({category, component, file}).then(setContent)
      import('./markdown.css') // eslint-disable-line
    },
    [params, file]
  )

  return content && <Markdown content={content} />
}

MarkdownFile.propTypes = {
  params: PropTypes.object,
  file: PropTypes.string
}
