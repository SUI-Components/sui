import { Mocker, ServerHandler, WorkerHandler } from './types'

const isNode =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]'

const getServerMocker = async (handlers: ServerHandler[]): Promise<Mocker> => {
  const setup = await import('msw/node').then(pkg => pkg.setupServer)
  const worker = setup(...handlers)

  return {
    ...worker,
    start: worker.listen,
    stop: worker.close
  }
}

const getClientMocker = async (handlers: WorkerHandler[]): Promise<Mocker> => {
  const setup = await import('msw').then(pkg => pkg.setupWorker)
  const worker = setup(...handlers)

  return {
    ...worker,
    listen: worker.start,
    close: worker.stop
  }
}

export const getMocker = isNode ? getServerMocker : getClientMocker
