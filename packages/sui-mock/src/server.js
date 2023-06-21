export {rest} from 'msw'

export const getServerMocker = async (handlers = []) => {
  const {setupServer} = require('msw/node')
  const worker = setupServer(...handlers)

  return {
    start: worker.start,
    stop: worker.stop,
    listen: worker.start,
    close: worker.stop,
    use: worker.use,
    resetHandlers: worker.resetHandlers,
    restoreHandlers: worker.restoreHandlers,
    printHandlers: worker.printHandlers
  }
}
