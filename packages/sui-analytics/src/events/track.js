import context from './common/context'
import getAnonymousId from '../anonymousUser'

export default data => ({
  anonymousId: getAnonymousId(),
  category: data.category,
  context,
  event: data.event,
  name: data.name,
  originalTimestamp: new Date().toISOString(),
  properties: {...data.properties},
  type: 'track',
  userId: data.userId
})
