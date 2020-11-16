import PropTypes from 'prop-types'
import snarkdown from '../../snarkdown'

export default function Markdown({content}) {
  return (
    content && (
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{__html: snarkdown(content)}}
      />
    )
  )
}

Markdown.propTypes = {
  content: PropTypes.string
}
