import PropTypes from 'prop-types'
import {useEffect} from 'react'

const createLinkElement = () => {
  const linkElement = document.createElement('link')
  const head = document.head || document.getElementsByTagName('head')[0]
  linkElement.rel = 'stylesheet'
  head.appendChild(linkElement)
  return linkElement
}

export default function Style({children, id}) {
  useEffect(
    function() {
      const linkElement = createLinkElement()

      const blob = new window.Blob([children], {type: 'text/css'})
      const oldSrc = linkElement.href
      linkElement.href = window.URL.createObjectURL(blob)
      linkElement.id = id
      oldSrc && window.URL.createObjectURL(blob)

      return () => linkElement.parentNode.removeChild(linkElement)
    },
    [children, id]
  )

  return null
}

Style.propTypes = {
  children: PropTypes.array
}
