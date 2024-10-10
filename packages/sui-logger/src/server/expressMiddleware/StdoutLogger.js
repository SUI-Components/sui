import {Readable, Writable} from 'stream'

import {getRequestData} from '../utils/format'

const {NODE_ENV} = process.env

export class StringStream extends Readable {
  constructor(str, encoding) {
    super()
    this._str = str
    this._encoding = encoding || 'utf8'
  }

  _read() {
    if (!this.ended) {
      process.nextTick(() => {
        this.push(Buffer.from(this._str, this._encoding))
        this.push(null)
        this._str = null
      })
      this.ended = true
    }
  }
}

export class StdoutLogger extends Writable {
  /**
   * @param {Function} options.getTenantService - @returns {String}
   * @param {Stream} options.stream
   * @param {String} options.team
   */
  constructor({getTenantService, stream, team} = {}) {
    super({objectMode: true})
    this._getTenantService = getTenantService
    this._Stream = stream
    this._team = team
  }

  _write(chunk, encoding, cb) {
    const {req, res, req_id, time, duration, name, ...log} = chunk // eslint-disable-line
    const requestData = getRequestData({req})

    let msg = {
      ...requestData,
      http_status_code: res ? res.statusCode : 0,
      l_time: duration,
      node_env: NODE_ENV || '-',
      program: name,
      request_id: (req && req.headers.http_x_amz_cf_id) || req_id, // eslint-disable-line
      team: this._team,
      timestamp: Date.parse(time)
    }

    if (this._getTenantService) {
      msg.tenant = req ? this._getTenantService(req) : '-'
    }

    const string = new this._Stream(JSON.stringify(msg) + '\n')

    string.pipe(process.stdout)
    string.on('end', () => {
      msg = null
      chunk = null
      cb()
    })
  }
}

export const getStdoutStream = options => new StdoutLogger({...options, stream: StringStream})
