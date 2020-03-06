import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {Meta} from 'react-head'

const BODY_ATTRIBUTES_KEY = 'data-bodyattributes'

function Body({bodyAttributes = {}}) {
  useEffect(function() {
    // on the client, set the needed attributes
    if (typeof document !== 'undefined' && document.body) {
      Object.entries(bodyAttributes).forEach(([key, value]) => {
        document.body.setAttribute(key, value)
      })
      return null
    }
  })
  // on the client, set the needed attributes
  if (typeof document !== 'undefined' && document.body) {
    Object.entries(bodyAttributes).forEach(([key, value]) => {
      document.body.setAttribute(key, value)
    })
    return null
  }
  const metaProps = {...bodyAttributes, [BODY_ATTRIBUTES_KEY]: ''}

  // on the server, use the Meta tag to extract later
  return <Meta {...metaProps} />
}

Body.propTypes = {
  bodyAttributes: PropTypes.object
}

export default Body
