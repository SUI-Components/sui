import ClientMocker from './clientMocker'
import ServerMocker from './serverMocker'

const isServer = typeof process !== 'undefined' && process.env.VITEST_MODE === 'server'

export default isServer ? ServerMocker : ClientMocker
