import * as React from 'react'
import {Children as ReactChildren} from 'react'

import {type Style, type Tag} from './types'

const checkRelNeedsHref = (rel: string): boolean => ['alternate', 'preload', 'prefetch'].includes(rel)

/**
 * Use rel as key but put extra info if needed
 * to avoid duplicated keys
 */
const extractRelAsKey = (tag: Tag): string | undefined => {
  const {rel, href, hreflang} = tag
  if (rel != null) {
    if (hreflang != null) return `${rel}-${hreflang}`
    if (checkRelNeedsHref(rel) && href != null) return `${rel}-${href}`
    return rel
  }
}

/**
 * Extract value in a specific order
 */
const extractKeyFromTag = (tag: Tag): string | undefined => {
  const {name, content} = tag
  return name ?? extractRelAsKey(tag) ?? content
}

/**
 * Extract children from React by tag type and return an array of React Type Component
 */
export const extract = ({children, byTag}: {children: React.ReactNode; byTag: string}): Tag[] => {
  const arrayOfComponents = ReactChildren.toArray(children)
  return arrayOfComponents
    .filter(child => React.isValidElement(child) && child.type === byTag)
    .map(child => {
      const el = child as React.ReactElement
      return {...el.props}
    })
}

interface extractTagsFromParams {
  children: React.ReactNode
  tag: 'meta' | 'link' | 'title' | 'style'
  fallback?: any[]
}

export const extractTagsFrom = ({children, tag, fallback}: extractTagsFromParams): any[] => {
  if (children != null) {
    return extract({children, byTag: tag})
  }

  return fallback ?? []
}

interface extractTitleFromParams {
  children: React.ReactNode
  fallback?: string
}

export const extractTitleFrom = ({children, fallback = ''}: extractTitleFromParams): string => {
  if (typeof children === 'undefined') return fallback

  const listOfTitles = extract({children, byTag: 'title'})
  if (listOfTitles.length > 0) {
    const [title] = listOfTitles

    return title.children ?? fallback
  }
  return fallback
}

/**
 * Use the correct component to render the tag
 */
interface renderTagsParams {
  tagsArray: any[]
  Component: React.ComponentType<any>
}
export const renderTags = ({tagsArray = [], Component}: renderTagsParams): JSX.Element[] =>
  tagsArray.map((tag: Tag) => {
    const {hreflang: hrefLang, ...restOfTagInfo} = tag
    return <Component key={extractKeyFromTag(tag)} hrefLang={hrefLang} {...restOfTagInfo} />
  })

/**
 * Use the correct component to render the tag
 */
interface renderStylesParams {
  stylesArray: any[]
  Component: React.ComponentType<any>
}
export const renderStyles = ({stylesArray = [], Component}: renderStylesParams): JSX.Element[] =>
  stylesArray.map((style: Style, index: number) => {
    const {children, ...styleAttr} = style
    return (
      <Component key={index} {...styleAttr}>
        {children}
      </Component>
    )
  })
