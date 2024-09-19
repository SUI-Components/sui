export const referrerState = {
  spaReferrer: '',
  referrer: ''
}

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
   * @returns {string} The actual location with protocol, domain and pathname
   */
  getActualQueryString: () => {
    const {search} = window.location
    return search
  }
}

/**
 * Get the correct page referrer for SPA navigations
 * @returns {string}  referrer
 */
export const getPageReferrer = ({isPageTrack = false} = {}) => {
  const {referrer, spaReferrer} = referrerState
  // if we're a page, we should use the new referrer that was calculated with the previous location
  // if we're a track, we should use the previous referrer, as the location hasn't changed yet
  const referrerToUse = isPageTrack ? referrer : spaReferrer
  // as a fallback for page and tracks, we must use always the document.referrer
  // because some sites could not be using `page` or a `track` could be done
  // even before the first page
  return referrerToUse || utils.getDocumentReferrer()
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

  payload.obj.context = {
    ...context,
    page: {
      ...context.page,
      referrer
    }
  }

  // update page referrer only if it's a page event
  isPageTrack && updatePageReferrer()
  next(payload)
}
