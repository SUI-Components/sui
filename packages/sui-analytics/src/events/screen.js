import context from './common/context'
import getAnonymousId from '../anonymousUser'

export default data => ({
  originalTimestamp: new Date().toISOString(),
  anonymousId: getAnonymousId(),
  category: data.category,
  context,
  name: data.name,
  properties: {...data.properties},
  type: 'screen',
  userId: data.userId
})
