// /* global __MOCKS_API_PATH__ */
import {http} from 'msw'

import {getBrowserMocker} from './browser.js'
import {getServerMocker} from './server.js'

const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'
const setupMocker = isNode ? getServerMocker : getBrowserMocker

export {setupMocker, http as rest}
