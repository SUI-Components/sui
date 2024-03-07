export {rest} from 'msw'

export const getBrowserMocker = async (handlers = []) => {
  const setup = await import('msw').then(pkg => pkg.setupWorker)
  const worker = setup(...handlers)

  return {
    start: worker.start.bind(worker),
    stop: worker.stop.bind(worker),
    listen: worker.start.bind(worker),
    close: worker.stop.bind(worker),
    use: worker.use.bind(worker),
    resetHandlers: worker.resetHandlers.bind(worker),
    restoreHandlers: worker.restoreHandlers.bind(worker),
    printHandlers: worker.printHandlers.bind(worker)
  }
}
