import path from 'path'
import fs from 'fs'
import ssrConf from './config'

const INDEX_FILE = 'index.html'
const INDEX_WITHOUT_THIRD_PARTIES_FILE = 'index_without_third_parties.html'
const DEFAULT_SITE_HEADER = 'X-Serve-Site'
const DEFAULT_PUBLIC_FOLDER = 'public'
const EXPRESS_STATIC_CONFIG = {index: false}

const multiSiteMapping = ssrConf.multiSite
const multiSiteKeys = multiSiteMapping && Object.keys(multiSiteMapping)

export const isMultiSite =
  multiSiteKeys && multiSiteKeys.length > 0 && multiSiteKeys.includes('default')

export const siteFromReq = (req, header = DEFAULT_SITE_HEADER) =>
  req.get(header) || req.hostname

export const publicFolderByHost = req =>
  isMultiSite
    ? multiSiteMapping[siteFromReq(req)] || multiSiteMapping.default
    : DEFAULT_PUBLIC_FOLDER

export const useStaticsByHost = expressStatic => {
  let middlewares
  if (isMultiSite) {
    middlewares = Object.keys(multiSiteMapping).reduce(
      (acc, site) => ({
        ...acc,
        [site]: expressStatic(multiSiteMapping[site], EXPRESS_STATIC_CONFIG)
      }),
      {}
    )
  }

  return function serveStaticByHost(req, res, next) {
    const site = siteFromReq(req)
    const middleware = isMultiSite
      ? middlewares[site] || middlewares.default
      : expressStatic(DEFAULT_PUBLIC_FOLDER, EXPRESS_STATIC_CONFIG)

    middleware(req, res, next)
  }
}

export const readHtmlTemplate = req => {
  const index =
    req.query['disable-tealium'] === undefined
      ? INDEX_FILE
      : INDEX_WITHOUT_THIRD_PARTIES_FILE
  const filePath = path.join(process.cwd(), publicFolderByHost(req), index)

  return fs.readFileSync(filePath, 'utf8')
}

// Transform node performance timing to milliseconds
export const hrTimeToMs = diff => diff[0] * 1e3 + diff[1] * 1e-6
