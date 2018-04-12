/**
 * This function creates an event and dispatches it
 * @param {Object} dispatchEventParams
 * @param {string} dispatchEventParams.eventName
 * @param {Object} dispatchEventParams.detail
 **/
export function dispatchEvent ({eventName, detail = {}}) {
  let event
  // check if native CustomEvent is available and use it
  if (window.CustomEvent && typeof window.CustomEvent === 'function') {
    event = new window.CustomEvent(eventName, {detail})
  } else {
    event = document.createEvent('CustomEvent')
    event.initCustomEvent(eventName, true, true, detail)
  }

  window.document.dispatchEvent(event)
}
