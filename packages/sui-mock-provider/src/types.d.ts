import { RequestHandler as WorkerHandler } from 'msw'
import { RequestHandler as ServerHandler } from 'msw/node'

type Mocker = SetupWorkerApi & SetupServerApi

export { WorkerHandler, ServerHandler, Mocker }
