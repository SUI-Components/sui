export {http as rest} from 'msw'

export const getBrowserMocker = async (handlers = []) => {
  const setup = await import('msw/browser').then(pkg => pkg.setupWorker)
  const worker = setup(...handlers)

  return {
    close: worker.close,
    listen: worker.listen,
    printHandlers: worker.printHandlers,
    resetHandlers: worker.resetHandlers,
    restoreHandlers: worker.restoreHandlers,
    start: worker.start,
    stop: worker.stop,
    use: worker.use
  }
}
