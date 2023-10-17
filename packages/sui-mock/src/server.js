export {rest} from 'msw'

export const getServerMocker = async (handlers = []) => {
  const setupServer = await import('msw/node').then(pkg => pkg.setupServer)
  const worker = setupServer(...handlers)

  return {
    start: worker.listen.bind(worker),
    stop: worker.close.bind(worker),
    listen: worker.listen.bind(worker),
    close: worker.close.bind(worker),
    use: worker.use.bind(worker),
    resetHandlers: worker.resetHandlers.bind(worker),
    restoreHandlers: worker.restoreHandlers.bind(worker),
    printHandlers: worker.printHandlers.bind(worker)
  }
}
