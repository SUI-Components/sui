import ServerMocker from './serverMocker'
import ClientMocker from './clientMocker'

const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

export default isNode ? ServerMocker : ClientMocker
