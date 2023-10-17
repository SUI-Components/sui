import {getBrowserMocker} from './browser.js'
import {getServerMocker} from './server.js'

const isNode =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]'

export {rest} from 'msw'
export const setupMocker = isNode ? getServerMocker : getBrowserMocker
