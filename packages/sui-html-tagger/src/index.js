import debounce from 'just-debounce-it'

const hasWindow = typeof window !== 'undefined'
const hasIdle = hasWindow && window.requestIdleCallback
const hasRAF = hasWindow && window.requestAnimationFrame

const MANUAL_INTERVAL = 250 // ms
const PREFIX_TAG = 'data-'
const MUTATION_OBSERVER_CONFIG = {
  attributes: false,
  characterData: false,
  childList: true,
  subtree: true
}

function onIdle(cb) {
  let timerId
  if (hasIdle) {
    timerId = window.requestIdleCallback(function(idleDeadline) {
      // reschedule if there's less than 1ms remaining on the tick
      // and a timer did not expire
      return idleDeadline.timeRemaining() <= 1 && !idleDeadline.didTimeout
        ? onIdle(cb)
        : cb(idleDeadline)
    })
    return window.cancelIdleCallback.bind(window, timerId)
  } else if (hasRAF) {
    window.requestAnimationFrame(cb)
  } else {
    timerId = setTimeout(cb, 0)
    return clearTimeout.bind(window, timerId)
  }
}

export function tagHTML({tags}) {
  const fireTagging = debounce(
    () => onIdle(searchTagsToTrackOnDocument),
    500,
    true
  )

  // check if the DOMContentLoaded has been already fired
  if (/comp|inter|loaded/.test(document.readyState)) {
    startTagger()
  } else {
    // when document is totally loaded, to avoid repaints while loading
    document.addEventListener('DOMContentLoaded', startTagger, false)
  }

  function startTagger() {
    fireTagging()
    return !window.MutationObserver
      ? useManualIntervalTracking() // eslint-disable-line
      : useMutationObserverTracking() // eslint-disable-line
  }

  function useMutationObserverTracking() {
    // create an observer instance
    const observer = new window.MutationObserver(function(mutations) {
      const numberOfMutations = mutations.length
      for (let i = 0; i < numberOfMutations; i++) {
        const mutation = mutations[i]
        // only fire the tagging when nodes are added
        // because this will be fired for removed nodes as well
        if (mutation.addedNodes.length) {
          fireTagging()
        }
      }
    })

    // pass in the body as target node, as well as the observer options
    observer.observe(document.body, MUTATION_OBSERVER_CONFIG)
  }

  function useManualIntervalTracking() {
    let start = Date.now()
    let finish = Date.now()

    function step() {
      if (finish - start > MANUAL_INTERVAL) {
        fireTagging()
        start = finish
      }
      finish = Date.now()
      onIdle(step)
    }

    onIdle(step)
  }

  function addTrackingTagsToElement(el, trackingTags) {
    for (const tag in trackingTags) {
      const attrName = PREFIX_TAG + tag
      const trackingTagValue = trackingTags[tag]
      // Never retagging a previous DOM with the same value
      if (el.getAttribute(attrName) === trackingTagValue) {
        break
      }
      el.setAttribute(attrName, trackingTagValue)
    }
  }

  function searchTagsToTrackOnDocument() {
    for (const key in tags) {
      const arrayDOMElements = Array.prototype.slice.call(
        document.querySelectorAll(key)
      )
      for (let i = 0; i < arrayDOMElements.length; i++) {
        addTrackingTagsToElement(arrayDOMElements[i], tags[key])
      }
    }
  }
}
