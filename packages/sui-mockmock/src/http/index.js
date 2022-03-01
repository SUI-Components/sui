import ServerMocker from './serverMocker.js'
import ClientMocker from './clientMocker.js'

const isNode =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]'

export default isNode ? ServerMocker : ClientMocker
