/* eslint operator-linebreak:0 */
import ssrConf from './config'

const DEFAULT_SITE_HEADER = 'X-Serve-Site'
const DEFAULT_PUBLIC_FOLDER = 'public'
const EXPRESS_STATIC_CONFIG = {index: false}
const multiSiteMapping = ssrConf.multiSite
const multiSiteKeys = multiSiteMapping && Object.keys(multiSiteMapping)
const isMultiSite =
  multiSiteKeys && multiSiteKeys.length > 0 && multiSiteKeys.includes('default')

const siteFromReq = (req, header = DEFAULT_SITE_HEADER) =>
  req.get(header) || req.hostname

export const publicFolderByHost = req =>
  isMultiSite
    ? multiSiteMapping[siteFromReq(req)] || multiSiteMapping.default
    : DEFAULT_PUBLIC_FOLDER

export const useStaticsByHost = expressStatic => {
  const middlewares = Object.keys(multiSiteMapping).reduce(
    (acc, site) => ({
      ...acc,
      [site]: expressStatic(multiSiteMapping[site], EXPRESS_STATIC_CONFIG)
    }),
    {}
  )

  return function serveStaticByHost(req, res, next) {
    const site = siteFromReq(req)
    const middleware = isMultiSite
      ? middlewares[site] || middlewares.default
      : expressStatic(DEFAULT_PUBLIC_FOLDER, EXPRESS_STATIC_CONFIG)

    middleware(req, res, next)
  }
}
