export {http as rest} from 'msw'

export const getBrowserMocker = async (handlers = []) => {
  const setup = await import('msw').then(pkg => pkg.setupWorker)
  const worker = setup(...handlers)

  return {
    ...worker,
    listen: worker.start,
    close: worker.stop
  }
}
