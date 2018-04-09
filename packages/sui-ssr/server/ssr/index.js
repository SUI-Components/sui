// __MAGIC IMPORTS__
// They came from {SPA}/node_modules or {SPA}/src
import routes from 'routes'
import { RouterContext, match } from 'react-router'
import Helmet from 'react-helmet'
import {
  createServerContextFactoryParams,
  ssrComponentWithInitialProps
} from '@s-ui/react-initial-props'
// END __MAGIC IMPORTS__

import qs from 'querystring'
import path from 'path'
import fs from 'fs'
import util from 'util'
import withContext from '@s-ui/hoc/lib/withContext'

// __MAGIC IMPORTS__
let contextFactory
try {
  contextFactory = require('contextFactory').default
} catch (e) {
  contextFactory = async () => ({})
}
// END __MAGIC IMPORTS__

const readFile = util.promisify(fs.readFile)

const HTTP_PERMANENT_REDIRECT = 301
const INDEX_HTML_PATH = path.join(process.cwd(), 'public', 'index.html')
const APP_PLACEHOLDER = '<!-- APP -->'
const injectDataHydratation = (data = {}) => {
  const escapedJson = JSON.stringify(data).replace(/<\//g, '<\\/')
  return `<script>window.__INITIAL_PROPS__=${escapedJson}</script>`
}

export default (req, res, next) => {
  const { url, query } = req
  match(
    { routes, location: url },
    async (error, redirectLocation, renderProps) => {
      if (error || !renderProps) {
        return next(error || new Error(`No renderProps for ${url}`))
      }

      if (redirectLocation) {
        const queryString = Object.keys(query).length
          ? `?${qs.stringify(query)}`
          : ''
        const destination = `${redirectLocation.pathname}${queryString}`
        return res.redirect(HTTP_PERMANENT_REDIRECT, destination)
      }

      const html = await readFile(INDEX_HTML_PATH, 'utf8')
      const [criticalHTML, bodyHTML] = html.split('</head>')

      res.type('html')
      res.write(criticalHTML)
      res.flush()

      const context = await contextFactory(
        createServerContextFactoryParams(req)
      )
      const { initialProps, reactString } = await ssrComponentWithInitialProps({
        context,
        renderProps,
        Target: withContext(context)(RouterContext)
      })

      const head = Helmet.renderStatic()
      res.write(
        Object.keys(head)
          .map(section => head[section].toString())
          .join('')
      )
      res.flush()

      // eslint-disable-next-line
      // debugger

      res.end(
        `</head>${bodyHTML}`
          .replace(APP_PLACEHOLDER, reactString)
          .replace('</body>', `${injectDataHydratation(initialProps)}</body>`)
      )
    }
  )
}
