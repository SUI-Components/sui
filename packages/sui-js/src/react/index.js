import htmr from 'htmr'

export const htmlStringToReactElement = (string, options) => htmr(string, {
  ...options,
  transform: {
    script: () => null,
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
