import Tracker from './Tracker'

export default class BrowserTracker extends Tracker {
  constructor({
    algorithm,
    fnName,
    host,
    port,
    protocol,
    segmentation,
    env = Tracker.ENV_BROWSER
  } = {}) {
    super({algorithm, fnName, host, port, protocol, segmentation, env})
  }

  _send({headers, hostname, path, port} = {}) {
    const request = new window.XMLHttpRequest()

    request.open('GET', `${this._protocol}://${hostname}:${port}${path}`)
    request.setRequestHeader('x-payload', headers['x-payload'])
    request.send()
  }
}
