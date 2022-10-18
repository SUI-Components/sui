import {rest} from 'msw'

import {getBrowserMocker} from './browser.js'
import {getServerMocker} from './server.js'

const isNode =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]'

const getMocker = isNode ? getServerMocker : getBrowserMocker

export {getMocker, rest}
