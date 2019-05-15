/* eslint operator-linebreak:0 */
import ssrConf from './config'

const DEFAULT_PUBLIC_FOLDER = 'public'
const EXPRESS_STATIC_CONFIG = {index: false}
const APP_NAME = process.env.APP_NAME
const multiSite = ssrConf.multiSite
const {defaultDomainPattern, foldersMapping} = multiSite || {}
const isMultiSite = foldersMapping && Object.keys(foldersMapping).length > 0

const siteFromReq = (reqHeaders, header = 'x-serve-site') =>
  reqHeaders[header] ||
  (reqHeaders.host.match(/localhost/) && defaultDomainPattern && APP_NAME
    ? defaultDomainPattern.replace('%APP_NAME%', APP_NAME)
    : reqHeaders.host)

const publicFolderByHost = reqHeaders =>
  isMultiSite
    ? foldersMapping[siteFromReq(reqHeaders)] || foldersMapping.default
    : DEFAULT_PUBLIC_FOLDER

const useStaticsByHost = expressStatic => {
  const middlewares = Object.keys(foldersMapping).reduce(
    (acc, site) => ({
      ...acc,
      site: expressStatic(foldersMapping[site], EXPRESS_STATIC_CONFIG)
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

exports = {
  publicFolderByHost,
  useStaticsByHost
}
