import path from 'path'
import fs from 'fs'
import ssrConf from './config'

const INDEX_FILE = 'index.html'
const INDEX_WITHOUT_THIRD_PARTIES_FILE = 'index_without_third_parties.html'
const DEFAULT_SITE_HEADER = 'X-Serve-Site'
const DEFAULT_PUBLIC_FOLDER = 'public'
const DEFAULT_MULTI_SITE_KEY = 'default'
const EXPRESS_STATIC_CONFIG = {index: false}

const multiSiteMapping = ssrConf.multiSite
const multiSiteKeys = multiSiteMapping && Object.keys(multiSiteMapping)

export const isMultiSite =
  multiSiteKeys &&
  multiSiteKeys.length > 0 &&
  multiSiteKeys.includes(DEFAULT_MULTI_SITE_KEY)

export const hostFromReq = (req, header = DEFAULT_SITE_HEADER) =>
  req.get(header) || req.hostname

export const hostPattern = req => {
  const host = hostFromReq(req)

  return (
    (multiSiteKeys &&
      multiSiteKeys.find(hostPattern => host.match(hostPattern))) ||
    DEFAULT_MULTI_SITE_KEY
  )
}

const multiSitePublicFolder = site => {
  const publicFolderPrefix = `${DEFAULT_PUBLIC_FOLDER}-`
  // Keep compatibility with those multi site configurations
  // that already define the public folder.
  return site.includes(publicFolderPrefix)
    ? site
    : `${publicFolderPrefix}${site}`
}

export const publicFolder = req => {
  const site = siteByHost(req)
  if (!site) return DEFAULT_PUBLIC_FOLDER

  return multiSitePublicFolder(site)
}

const siteByHostPattern = hostPattern =>
  isMultiSite && multiSiteMapping[hostPattern]

export const siteByHost = req => siteByHostPattern(hostPattern(req))

export const useStaticsByHost = expressStatic => {
  let middlewares
  if (isMultiSite) {
    middlewares = multiSiteKeys.reduce((acc, hostPattern) => {
      const site = siteByHostPattern(hostPattern)
      if (acc[site]) return acc

      return {
        ...acc,
        [site]: expressStatic(
          multiSitePublicFolder(site),
          EXPRESS_STATIC_CONFIG
        )
      }
    }, {})
  }

  return function serveStaticByHost(req, res, next) {
    const site = siteByHost(req)
    const middleware = isMultiSite
      ? middlewares[site]
      : expressStatic(DEFAULT_PUBLIC_FOLDER, EXPRESS_STATIC_CONFIG)

    middleware(req, res, next)
  }
}

export const readHtmlTemplate = req => {
  const index =
    ssrConf.queryDisableThirdParties &&
    req.query[ssrConf.queryDisableThirdParties] !== undefined
      ? INDEX_WITHOUT_THIRD_PARTIES_FILE
      : INDEX_FILE
  const filePath = path.join(process.cwd(), publicFolder(req), index)

  return fs.readFileSync(filePath, 'utf8')
}

// Transform node performance timing to milliseconds
export const hrTimeToMs = diff => diff[0] * 1e3 + diff[1] * 1e-6

const hostFromConfig = ({host}, req) => {
  const site = siteByHost(req)

  if (typeof host === 'undefined') return
  if (typeof host === 'string') return host
  if (!site)
    throw new Error(
      'You need a `multiSite` configuration in your package.json in order to use an object as a valid host value.`'
    )
  if (typeof host === 'object') return host[site]
}

export const buildRequestUrl = (config, req) => {
  const {CRITICAL_CSS_PROTOCOL, CRITICAL_CSS_HOST} = process.env
  const protocol = CRITICAL_CSS_PROTOCOL || config.protocol || req.protocol
  const host = CRITICAL_CSS_HOST || hostFromConfig(config, req) || req.hostname
  const url = `${protocol}://${host}${req.url}`

  return url
}
