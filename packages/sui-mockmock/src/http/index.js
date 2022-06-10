import ClientMocker from './clientMocker'
import ServerMocker from './serverMocker'

const isNode =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]'

export default isNode ? ServerMocker : ClientMocker
