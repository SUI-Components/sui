import {trackedEventsLocalCache as cache} from './trackedEventsLocalCache'
import {analytics} from './analytics'

cache.init()

export const serverTrackExperiment = () => {}

export const clientTrackExperiment = () => {
  return ({variationName, experimentName}) => {
    // if experiment has been already tracked
    if (cache.includes(experimentName, variationName)) return

    cache.push(experimentName, variationName)

    analytics({
      experimentName,
      variationName
    })
  }
}

export default () => {
  const isNode = typeof window === 'undefined'

  if (isNode) {
    return serverTrackExperiment
  }

  return clientTrackExperiment
}
