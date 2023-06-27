export {rest} from 'msw'

export const getServerMocker = async (handlers = []) => {
  const {setupServer} = require('msw/node')
  const worker = setupServer(...handlers)

  return {
    start: worker.listen,
    stop: worker.close,
    listen: worker.listen,
    close: worker.close,
    use: worker.use,
    resetHandlers: worker.resetHandlers,
    restoreHandlers: worker.restoreHandlers,
    printHandlers: worker.printHandlers
  }
}
