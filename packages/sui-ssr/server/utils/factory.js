const DEFAULT_SITE_HEADER = 'X-Serve-Site'
const DEFAULT_PUBLIC_FOLDER = 'public'
const DEFAULT_DEV_PUBLIC_FOLDER = '.sui/public'
const DEFAULT_MULTI_SITE_KEY = 'default'
const DEFAULT_STATICS_FOLDER = 'statics'
const EXPRESS_STATIC_CONFIG = {index: false}

let cachedCriticalManifest
let cachedAssetsManifest

export default ({path, fs, config: ssrConf = {}, assetsManifest}) => {
  const multiSiteMapping = ssrConf.multiSite
  const multiSiteKeys = multiSiteMapping && Object.keys(multiSiteMapping)

  const isMultiSite = multiSiteKeys && multiSiteKeys.length > 0 && multiSiteKeys.includes(DEFAULT_MULTI_SITE_KEY)

  const hostFromReq = (req, header = DEFAULT_SITE_HEADER) => req.get(header) || req.hostname

  const hostPattern = req => {
    const host = hostFromReq(req)

    return (multiSiteKeys && multiSiteKeys.find(hostPattern => host.match(hostPattern))) || DEFAULT_MULTI_SITE_KEY
  }

  const multiSitePublicFolder = site => {
    const publicFolderPrefix = `${DEFAULT_PUBLIC_FOLDER}-`
    // Keep compatibility with those multi site configurations
    // that already define the public folder.
    return site.includes(publicFolderPrefix) ? site : `${publicFolderPrefix}${site}`
  }

  const multiSiteStaticsFolder = site => {
    const staticsFolderPrefix = `${DEFAULT_STATICS_FOLDER}-`
    // Keep compatibility with those multi site configurations
    // that already define the statics folder.
    return site.includes(staticsFolderPrefix) ? site : `${staticsFolderPrefix}${site}`
  }

  const publicFolder = req => {
    if (process.env.DEV_SERVER === 'true') {
      return DEFAULT_DEV_PUBLIC_FOLDER
    }

    const site = siteByHost(req)

    if (!site) {
      return DEFAULT_PUBLIC_FOLDER
    }

    return multiSitePublicFolder(site)
  }

  const siteByHostPattern = hostPattern => isMultiSite && multiSiteMapping[hostPattern]

  const siteByHost = req => siteByHostPattern(hostPattern(req))

  const usePublicFolderByHost = expressStatic => {
    let middlewares
    if (isMultiSite) {
      middlewares = multiSiteKeys.reduce((acc, hostPattern) => {
        const site = siteByHostPattern(hostPattern)
        if (acc[site]) return acc

        return {
          ...acc,
          [site]: expressStatic(multiSitePublicFolder(site), EXPRESS_STATIC_CONFIG)
        }
      }, {})
    }

    return function serveStaticByHost(req, res, next) {
      const site = siteByHost(req)
      const middleware = isMultiSite ? middlewares[site] : expressStatic(DEFAULT_PUBLIC_FOLDER, EXPRESS_STATIC_CONFIG)

      middleware(req, res, next)
    }
  }

  const useStaticsFolderByHost = expressStatic => {
    let middlewares
    if (isMultiSite) {
      middlewares = multiSiteKeys.reduce((acc, hostPattern) => {
        const site = siteByHostPattern(hostPattern)
        if (acc[site]) return acc

        return {
          ...acc,
          [site]: expressStatic(multiSiteStaticsFolder(site), EXPRESS_STATIC_CONFIG)
        }
      }, {})
    }

    return function serveStaticByHost(req, res, next) {
      const site = siteByHost(req)
      const middleware = isMultiSite ? middlewares[site] : expressStatic(DEFAULT_STATICS_FOLDER)

      middleware(req, res, next)
    }
  }

  const readHtmlTemplate = req => {
    const filePath = path.join(process.cwd(), publicFolder(req), 'index.html')
    return fs.readFileSync(filePath, 'utf8')
  }

  // Transform node performance timing to milliseconds
  const hrTimeToMs = diff => diff[0] * 1e3 + diff[1] * 1e-6

  const getAssetsManifest = ({req}) => {
    const site = siteByHost(req)

    if (cachedAssetsManifest) {
      if (site && cachedAssetsManifest[site]) return cachedAssetsManifest[site]

      if (!site) return cachedAssetsManifest
    }

    let assetsManifest

    try {
      assetsManifest = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), publicFolder(req), 'asset-manifest.json'), 'utf8')
      )
      if (site) {
        cachedAssetsManifest = {
          ...cachedAssetsManifest,
          [site]: assetsManifest
        }
      } else {
        cachedAssetsManifest = assetsManifest
      }
    } catch (error) {
      assetsManifest = null
    }

    return assetsManifest
  }

  const getStyleHrefBy = ({pageName, req}) => {
    const assetsFile = assetsManifest || getAssetsManifest({req})

    return assetsFile && assetsFile[`${pageName}.css`]
  }

  const createStylesFor = ({pageName, async = false, req} = {}) => {
    if (!ssrConf.createStylesFor) return ''

    const appStyles = ssrConf.createStylesFor.appStyles
    const shouldCreatePageStyles = ssrConf.createStylesFor.createPagesStyles
    const stylesheets = [
      appStyles && getStyleHrefBy({pageName: appStyles, req}),
      shouldCreatePageStyles && getStyleHrefBy({pageName, req})
    ].filter(Boolean)
    const attributes = async ? ssrConf.ASYNC_CSS_ATTRS : ''
    const stylesHTML = stylesheets.map(style => `<link rel="stylesheet" href="${style}" ${attributes}>`).join('')

    return stylesHTML
  }

  const criticalDir = ({req}) => {
    const site = siteByHost(req)

    return site ? `critical-css/${site}` : 'critical-css'
  }

  const criticalManifest = ({req}) => {
    if (cachedCriticalManifest) return cachedCriticalManifest

    let criticalManifest = {}

    try {
      criticalManifest = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), criticalDir({req}), 'critical.json'), 'utf8')
      )
      cachedCriticalManifest = criticalManifest
    } catch (error) {
      console.warn('Manifest for Critical CSS is missing') // eslint-disable-line
    }

    return criticalManifest
  }

  return {
    getAssetsManifest,
    createStylesFor,
    hostFromReq,
    hrTimeToMs,
    isMultiSite,
    publicFolder,
    readHtmlTemplate,
    siteByHost,
    usePublicFolderByHost,
    useStaticsFolderByHost,
    criticalDir,
    criticalManifest
  }
}
