import {isClient} from '../config.js'
import {decorateContextWithNeededData, getDefaultProperties} from '../segmentWrapper.js'

const MPI_PATCH_FIELD = '__mpi_patch'

function monkeyPatchAnalyticsTrack() {
  const {track: originalTrack} = window.analytics
  window.analytics.track = (...args) => {
    const [event, properties, contextFromArgs, fn] = args
    const newProperties = {
      ...getDefaultProperties(),
      ...properties
    }
    decorateContextWithNeededData({
      context: contextFromArgs,
      event
    }).then(context => {
      originalTrack.call(window.analytics, event, newProperties, context, fn)
    })
    return window.analytics
  }
  // add a flag to the patched analytics so we don't patch this twice
  window.analytics[MPI_PATCH_FIELD] = true
}

if (isClient) {
  if (!window.analytics) {
    console.warn('Segment Analytics is not loaded so patch is not applied.')
  } else if (!window.analytics[MPI_PATCH_FIELD]) {
    window.analytics.initialized ? monkeyPatchAnalyticsTrack() : window.analytics.ready(monkeyPatchAnalyticsTrack)
  }
}
