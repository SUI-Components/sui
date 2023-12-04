import htmr from 'htmr'

// This is a list of all the elements that should not be allowed to be rendered as they pose a security risk.
// See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
// If you want to allow one of these elements, you can add it to the `transform` object in the `options`.
export const DANGEROUS_TRANSFORMS = {
  area: () => null,
  audio: () => null,
  base: () => null,
  canvas: () => null,
  embed: () => null,
  form: () => null,
  frame: () => null,
  frameset: () => null,
  head: () => null,
  html: () => null,
  iframe: () => null,
  img: () => null,
  link: () => null,
  map: () => null,
  meta: () => null,
  noscript: () => null,
  object: () => null,
  picture: () => null,
  portal: () => null,
  script: () => null,
  slot: () => null,
  source: () => null,
  style: () => null,
  template: () => null,
  title: () => null,
  track: () => null,
  video: () => null
}

export const htmlStringToReactElement = (string, options) =>
  htmr(string, {
    ...options,
    transform: {
      ...DANGEROUS_TRANSFORMS,
      ...options?.transform
    }
  })

const isReactRefObj = target => {
  if (target && typeof target === 'object') {
    return 'current' in target
  }
  return false
}

const findDOMElements = target => {
  if (isReactRefObj(target)) return target.current
  if (typeof target === 'string') {
    let selection = document.querySelectorAll(target)
    if (!selection.length) selection = document.querySelectorAll(`#${target}`)
    if (!selection.length) {
      throw new Error(`The target '${target}' could not be identified in the dom, tip: check spelling`)
    }
    return selection
  }
  return target
}

const isArrayOrNodeList = els => {
  if (els === null) return false
  return Array.isArray(els) || typeof els.length === 'number'
}

export const getTarget = target => {
  const els = findDOMElements(target)
  if (isArrayOrNodeList(els)) {
    return els[0]
  }
  return els
}
