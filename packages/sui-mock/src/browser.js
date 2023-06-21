export {rest} from 'msw'

export const getBrowserMocker = async (handlers = []) => {
  const setup = await import('msw').then(pkg => pkg.setupWorker)
  const worker = setup(...handlers)

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
