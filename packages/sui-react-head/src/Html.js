import React from 'react'
import PropTypes from 'prop-types'
import {Meta} from 'react-head'

export const HTML_ATTRIBUTES_KEY = 'data-htmlattributes'
const isClient = typeof window !== 'undefined'

export default function Html({htmlAttributes = {}}) {
  if (isClient) return null
  // on the server, use the Meta tag to extract later
  const metaProps = {...htmlAttributes, [HTML_ATTRIBUTES_KEY]: ''}
  return <Meta {...metaProps} />
}

Html.propTypes = {
  htmlAttributes: PropTypes.object
}
