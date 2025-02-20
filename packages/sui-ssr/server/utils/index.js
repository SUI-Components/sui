import fs from 'fs'
import path from 'path'

import config from '../config.js'
import utilsFactory from './factory.js'

const {
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
} = utilsFactory({path, fs, config})

export {
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
