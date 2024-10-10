import {Writable} from 'stream'

import StatsD from 'hot-shots'

import {match} from '@s-ui/react-router'

const {NODE_ENV} = process.env

export class DataDogLogger extends Writable {
  /**
   * @param {Object} options.globalTags - Example: {node_ssr: 'milanuncios'}
   * @param {import('react').ComponentType} options.routes
   */
  constructor({client, routes} = {}) {
    super({objectMode: true})
    this._client = client
    this._routes = routes
  }

  _write(chunk, encoding, cb) {
    let {req, res, req_id, time, duration, name, ...log} = chunk // eslint-disable-line

    let statusCode = res ? res.statusCode : 0
    let statusFamily = parseInt(statusCode / 100) + 'xx'
    let globalTags = {
      status: statusCode,
      status_family: statusFamily,
      method: req ? req.method : '-' // eslint-disable-line
    }

    if (!req || statusFamily === '4xx' || statusFamily === '3xx') {
      this._client.timing('http.server.requests', duration, globalTags)
      chunk = null
      globalTags = null
      statusFamily = null
      statusCode = null
      return cb()
    }

    match({routes: this._routes, location: req.url}, async (error, redirectLocation, renderProps) => {
      if (error) {
        return cb()
      }

      if (!renderProps) {
        return cb()
      }

      let hashURI = this._generateURIHash(renderProps.routes)
      globalTags.uri = hashURI

      this._client.timing('http.server.requests', duration, globalTags)

      hashURI = null
      chunk = null
      globalTags = null
      statusFamily = null
      statusCode = null

      cb()
    })
  }

  _generateURIHash = routes => {
    return routes.reduce((acc, route) => {
      route.path && (acc += route.path)
      return acc
    }, '')
  }
}

export const getDataDogStream = ({globalTags = {}, routes} = {}) => {
  const client = new StatsD({
    errorHandler: error => {
      console.log('Socket errors caught here: ', error) // eslint-disable-line no-console
    },
    globalTags: {
      env: NODE_ENV,
      ...globalTags
    },
    maxBufferSize: 100
  })

  return new DataDogLogger({client, routes})
}
