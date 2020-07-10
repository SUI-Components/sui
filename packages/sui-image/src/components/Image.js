import React from 'react'
import PropTypes from 'prop-types'
import AtomImage from '@s-ui/react-atom-image'

const Image = ({src, alt, ...htmlAttributes}) => {
  return (
    <div className="sui-Image">
      <AtomImage src={src} alt={alt} {...htmlAttributes} />
    </div>
  )
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
}

export default Image
