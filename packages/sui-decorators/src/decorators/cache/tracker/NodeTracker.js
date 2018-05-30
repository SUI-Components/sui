import Tracker from './Tracker'
import http from 'http'
import https from 'https'

export default class NodeTracker extends Tracker {
  constructor({
    algorithm,
    fnName,
    host,
    port,
    protocol,
    segmentation,
    env = Tracker.ENV_SERVER
  } = {}) {
    super({algorithm, fnName, host, port, protocol, segmentation, env})
  }

  _send({headers, hostname, path, port} = {}) {
    const client = this._protocol === 'http' ? http : https
    const request = client.get({
      hostname,
      port,
      path,
      headers
    })

    request.end()
  }
}
