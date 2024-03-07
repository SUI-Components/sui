/* eslint-disable react/prop-types */

import * as React from 'react'
import {HeadProvider, Link, Meta as MetaPrimitive, Style, Title} from 'react-head'

import Body from './Body'
import Html from './Html'
import {extractTagsFrom, extractTitleFrom, renderStyles, renderTags} from './utils'

interface HeadProps {
  bodyAttributes?: object
  children?: React.ReactNode
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

interface MetaProps extends React.ComponentProps<typeof MetaPrimitive> {}

interface MetaTagInverterProps extends React.MetaHTMLAttributes<HTMLMetaElement> {
  'data-rh': string
}

const MetaTagInverter: React.FC<MetaTagInverterProps> = ({'data-rh': rh, ...others}) => {
  return <meta {...others} data-rh={rh} />
}

const Meta: React.FC<MetaProps> = props => {
  // @ts-expect-error: We should expect any error
  return <MetaPrimitive {...props} tag={MetaTagInverter} />
}

const Head: React.FC<HeadProps> = ({bodyAttributes, children, htmlAttributes, title, meta = [], link = []}) => {
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
  const stylesTagsToRender = extractTagsFrom({
    children,
    tag: 'style'
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
      {renderTags({tagsArray: metaTagsToRender, Component: Meta})}
      {renderTags({tagsArray: linkTagsToRender, Component: Link})}
      {renderStyles({stylesArray: stylesTagsToRender, Component: Style})}
      {bodyAttributes != null && <Body attributes={bodyAttributes} />}
      {htmlAttributes != null && <Html attributes={htmlAttributes} />}
    </>
  )
}

export {HeadProvider}
export default Head
