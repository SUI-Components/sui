/* eslint-disable react/prop-types */

import {Meta} from 'react-head'

export const HTML_ATTRIBUTES_KEY = 'htmlattributes'
const isClient = typeof window !== 'undefined'

interface HtmlProps {
  attributes: object
}

const Html: React.FC<HtmlProps> = ({attributes = {}}) => {
  if (isClient) return null
  // on the server, use the Meta tag to extract later
  const metaProps = {...attributes, name: HTML_ATTRIBUTES_KEY}
  return <Meta {...metaProps} />
}

export default Html
