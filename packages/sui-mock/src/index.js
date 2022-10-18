import {getBrowserMocker} from './browser.js'
import {getServerMocker} from './server.js'

const isNode =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]'

const initMocker = isNode ? getServerMocker : getBrowserMocker

export {rest} from 'msw'
export default initMocker
