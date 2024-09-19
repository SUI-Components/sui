import {getConfig} from '../../config.js'

const DEFAULT_CONTEXT = {platform: 'web'}

export const defaultContextProperties = ({payload, next}) => {
  const defaultContext = getConfig('defaultContext') || {}

  payload.obj.context = {
    ...DEFAULT_CONTEXT,
    ...defaultContext,
    ...payload.obj.context
  }

  next(payload)
}
