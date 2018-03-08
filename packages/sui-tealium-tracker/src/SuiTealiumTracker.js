import { FunctionThrottler } from './FunctionThrottler'
import { dispatchEvent } from '@s-ui/js/lib/events'

const ELEMENTS_CLICKABLE = ['A', 'BUTTON', 'DIV', 'INPUT', 'SVG']
const ELEMENT_NODE = 1
const THROTTLE_WAIT = 100

/**
 * SuiTealiumTracker
 */
export class SuiTealiumTracker {
  constructor (customEventName) {
    this.customEventName = customEventName
    this.sendTealiumThrottled = FunctionThrottler.throttle(this.sendTealium, THROTTLE_WAIT)
  }

  init () {
    this.initClickListener()
    this.initChangeListener()
    this.customEventName && this.promoteDispatchCustomEventToWindow()
    this.customEventName && this.initCustomEventListener()
  }

  initClickListener () {
    document.addEventListener('click', ({ target }) => {
      let node = target
      do {
        if (node.nodeType !== ELEMENT_NODE) { break }
        this.checkIfNeedToTrackClick({node})
        const parentTagName = node.parentElement && node.parentElement.tagName.toUpperCase()
        // search if the parent is a clickable element to check, otherwise we stop
        node = ELEMENTS_CLICKABLE.includes(parentTagName) ? node.parentElement : false
      } while (node)
    })
  }

  initChangeListener () {
    document.addEventListener('change', ({target}) => {
      const {options = [], selectedIndex = 0} = target
      const option = options[selectedIndex] || {dataset: {}}
      const {tealiumTag} = option.dataset
      if (tealiumTag) {
        this.sendTealiumThrottled(tealiumTag)
      }
    })
  }

  initCustomEventListener () {
    document.addEventListener(this.customEventName, (evt) => {
      const {tealiumTag} = evt.detail
      this.sendTealiumThrottled(tealiumTag)
    })
  }

  checkIfNeedToTrackClick ({node}) {
    const { dataset = {} } = node
    const { tealiumTag } = dataset

    tealiumTag && this.sendTealiumThrottled(tealiumTag)
  }

  promoteDispatchCustomEventToWindow () {
    window.dispatchCustomEvent = (detail) => dispatchEvent({ eventName: this.customEventName, detail })
  }

  sendTealium (eventName) {
    const data = Object.assign({}, window.utag_data, {'event_name': eventName})
    window.utag ? window.utag.link(data) : console.warn('There is no utag present on this site no event was dispatched.')
  }
}
