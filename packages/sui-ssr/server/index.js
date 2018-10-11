import express from 'express'
import ssr from './ssr'
import dynamicRendering from './dynamicRendering'
import {hooksFactory} from './hooksFactory'
import TYPES from '../hooks-types'
import basicAuth from 'express-basic-auth'
import path from 'path'
import fs from 'fs'
import jsYaml from 'js-yaml'
import parseDomain from 'parse-domain'

let ssrConf
try {
  const spaConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  )
  const {config = {}} = spaConfig
  ssrConf = config['sui-ssr'] || {}
} catch (e) {
  ssrConf = {}
}

const app = express()

app.set('x-powered-by', false)

// Read public env vars from public-env.yml file and make them available for
// middlewares by adding them to app.locals
try {
  const publicEnvFile = fs.readFileSync(
    path.join(process.cwd(), 'public-env.yml'),
    'utf8'
  )
  app.locals.publicEnvConfig = jsYaml.safeLoad(publicEnvFile)
} catch (err) {
  app.locals.publicEnvConfig = {}
}

const {PORT = 3000, AUTH_USERNAME, AUTH_PASSWORD} = process.env
const runningUnderAuth = AUTH_USERNAME && AUTH_PASSWORD
const AUTH_DEFINITION = {
  users: {[AUTH_USERNAME]: AUTH_PASSWORD},
  challenge: true
}
;(async () => {
  const hooks = await hooksFactory()

  app.get('/_health', (req, res) =>
    res.status(200).json({uptime: process.uptime()})
  )

  app.use(hooks[TYPES.LOGGING])
  runningUnderAuth && app.use(basicAuth(AUTH_DEFINITION))
  app.use(express.static('statics'))
  app.use(express.static('public', {index: false}))

  app.use(hooks[TYPES.APP_CONFIG_SETUP])

  ssrConf.forceWWW &&
    app.use((req, res, next) => {
      const parsedUrl = parseDomain(req.hostname, {
        customTlds: /localhost|\.local/
      })
      !parsedUrl || parsedUrl.tld === 'localhost' // eslint-disable-line
        ? next()
        : parsedUrl.subdomain
          ? next()
          : res.redirect(
              `${req.protocol}://www.` + req.headers.host + req.url,
              301
            )
    })

  app.get('*', dynamicRendering(ssr))

  app.use(hooks[TYPES.NOT_FOUND])
  app.use(hooks[TYPES.INTERNAL_ERROR])

  app.listen(PORT, () => console.log(`Server up & runnig port ${PORT}`)) // eslint-disable-line
})()
