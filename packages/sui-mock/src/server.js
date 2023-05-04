export {rest} from 'msw'

export const getServerMocker = async (handlers = []) => {
  const {setupServer} = require('msw/node')
  const worker = setupServer(...handlers)

  return {
    ...worker,
    start: worker.listen,
    stop: worker.close
  }
}
