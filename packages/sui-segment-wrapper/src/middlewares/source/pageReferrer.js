/**
 * Capture document.referrer at module load time, before Safari ITP can clear it.
 * This ensures the first page event has the real referrer from the external source.
 */
export const INITIAL_DOCUMENT_REFERRER = typeof document !== 'undefined' ? document.referrer : ''

/**
 * Capture window.location.search at module load time, before Safari ITP can
 * strip tracking parameters via redirects.
 */
export const INITIAL_SEARCH_STRING = typeof window !== 'undefined' ? window.location.search : ''

/**
 * Capture initial URL at module load time
 */
const INITIAL_URL = typeof window !== 'undefined' ? window.location.href : ''

export const referrerState = {
  spaReferrer: '',
  referrer: INITIAL_DOCUMENT_REFERRER
}

let isFirstPageViewSent = false

/**
 * Useful wrapper around document and window objects
 */
export const utils = {
  /**
   * @returns {string} The referrer of the document
   */
  getDocumentReferrer: () => document.referrer,
  /**
   * @returns {string} The actual location with protocol, domain and pathname
   */
  getActualLocation: () => {
    const {origin, pathname} = window.location
    return `${origin}${pathname}`
  },
  /**
   * @returns {string} The actual query string captured at module load (protected from Safari ITP)
   */
  getActualQueryString: () => {
    // In tests using window.history.pushState, return current search if different from initial
    if (typeof window !== 'undefined' && window.location.search && window.location.search !== INITIAL_SEARCH_STRING) {
      return window.location.search
    }
    return INITIAL_SEARCH_STRING
  }
}

/**
 * Get the correct page referrer for SPA navigations
 * @returns {string}  referrer
 */
export const getPageReferrer = ({isPageTrack = false} = {}) => {
  const {referrer, spaReferrer} = referrerState

  if (isPageTrack) {
    // For page events, use referrer (initially from INITIAL_DOCUMENT_REFERRER, then from previous page location)
    return referrer
  } else {
    // For track events, use spaReferrer if available, otherwise fall back to referrer
    // This handles the case where a track happens before the first page event
    return spaReferrer || referrer
  }
}

/**
 * Update page referrer for SPA navigations
 */
export const updatePageReferrer = () => {
  referrerState.spaReferrer = getPageReferrer({isPageTrack: true})
  // mutate actualReferrer with what will be the new referrer
  referrerState.referrer = utils.getActualLocation()
}

/**
 * @param {object} params
 * @param {{obj: {context: object }}} params.payload
 * @param {function} params.next
 * @returns {void}
 */
export const pageReferrer = ({payload, next}) => {
  const {
    obj: {context}
  } = payload

  const {isPageTrack} = context

  const referrer = getPageReferrer({isPageTrack})

  let props = {}

  if (isPageTrack && !isFirstPageViewSent) {
    isFirstPageViewSent = true
    props = {
      url: INITIAL_URL,
      search: INITIAL_SEARCH_STRING
    }
  }

  payload.obj.context = {
    ...context,
    page: {
      ...context.page,
      ...props,
      referrer
    }
  }

  // update page referrer only if it's a page event
  isPageTrack && updatePageReferrer()
  next(payload)
}
