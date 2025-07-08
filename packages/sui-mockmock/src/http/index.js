import ClientMocker from './clientMocker'
import ServerMocker from './serverMocker'

const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'
const useServerMocker = typeof process !== 'undefined' && process.env && process.env.FORCE_SERVER_MOCKER

let Mocker

if (useServerMocker === 'true') {
  Mocker = ServerMocker
} else if (useServerMocker === 'false') {
  Mocker = ClientMocker
} else if (isNode) {
  Mocker = ServerMocker
} else {
  Mocker = ClientMocker
}

export default Mocker
