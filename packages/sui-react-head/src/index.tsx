/* eslint-disable react/prop-types */

import * as React from 'react'
import { Title, HeadProvider, Link, Meta } from 'react-head'
import Body from './Body'
import Html from './Html'
import { extractTitleFrom, extractTagsFrom, renderTags } from './utils'

interface HeadProps {
  bodyAttributes?: object
  htmlAttributes?: object
  title?: string
  meta?: Array<{
    rel: string
    href: string
    hreflang: string
  }>
  link?: Array<{
    name: string
    content: string
  }>
}

const Head: React.FC<HeadProps> = ({
  bodyAttributes,
  children,
  htmlAttributes,
  title,
  meta = [],
  link = []
}) => {
  const metaTagsToRender = extractTagsFrom({
    children,
    tag: 'meta',
    fallback: meta
  })
  const linkTagsToRender = extractTagsFrom({
    children,
    tag: 'link',
    fallback: link
  })
  // title is a special case, so we have the extract from the array
  // and simplify the fallback as used by the method
  const titleToRender = extractTitleFrom({
    children,
    fallback: title
  })

  return (
    <>
      {titleToRender !== '' && <Title>{titleToRender}</Title>}
      {renderTags({ tagsArray: metaTagsToRender, Component: Meta })}
      {renderTags({ tagsArray: linkTagsToRender, Component: Link })}
      {(bodyAttributes != null) && <Body attributes={bodyAttributes} />}
      {(htmlAttributes != null) && <Html attributes={htmlAttributes} />}
    </>
  )
}

export { HeadProvider }
export default Head
