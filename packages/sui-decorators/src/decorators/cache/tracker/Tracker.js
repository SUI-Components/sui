export default class Tracker {
  static get ACTION_HIT () { return 'hits' }
  static get ACTION_MISSING () { return 'misses' }
  static get ENV_SERVER () { return 'server' }
  static get ENV_BROWSER () { return 'browser' }

  constructor ({
    algorithm,
    fnName,
    host,
    port = 80,
    protocol = 'http',
    segmentation,
    env
  } = {}) {
    this._algorithm = algorithm
    this._env = env
    this._fnName = fnName
    this._host = host
    this._port = port
    this._protocol = protocol
    this._segmentation = segmentation

    this._resetStats()
  }

  track ({action} = {}) {
    if (!this._host || !this._segmentation) { return }

    if (this._shouldSend()) {
      this._send({
        headers: {'x-payload': JSON.stringify({
          algorithm: this._algorithm,
          env: this._env,
          fnName: this._fnName,
          ...this._stats
        })},
        hostname: this._host.replace(/(https?)?:?\/\//g, ''),
        path: '/__tracking/cache/event/stats',
        port: this._port
      })
      this._resetStats()
    }
  }

  _updateStats ({action} = {}) {
    this._stats = {
      ...this._stats,
      [action]: ++this._stats[action]
    }
  }

  _resetStats () {
    this._stats = {
      [Tracker.ACTION_HIT]: 0,
      [Tracker.ACTION_MISSING]: 0
    }
  }

  _send ({path, headers, hostname} = {}) {
    throw new Error('[Tracker#_send] must be implemented')
  }

  _shouldSend () {
    return Math.floor(Math.random() * 100) + 1 <= this._segmentation
  }
}
