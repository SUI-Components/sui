import {renderToString} from 'react-dom/server'

const BODY_ATTRIBUTES_KEY = 'data-bodyattributes'
export function renderHeadTagsToString(headTags) {
  let bodyAttributes = ''
  let headTagsToRender = headTags

  const bodyAttributesIndex = headTags.findIndex(
    tag => typeof tag.props[BODY_ATTRIBUTES_KEY] !== 'undefined'
  )

  if (bodyAttributesIndex >= 0) {
    const {props: bodyAttributesObject} = headTags[bodyAttributesIndex]

    bodyAttributes = Object.entries(bodyAttributesObject)
      .filter(([key]) => key !== BODY_ATTRIBUTES_KEY)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')

    headTagsToRender = headTags.filter(
      (_, index) => index === bodyAttributesIndex
    )
  }

  return {headString: renderToString(headTagsToRender), bodyAttributes}
}
