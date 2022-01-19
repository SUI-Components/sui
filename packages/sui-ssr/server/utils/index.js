import path from 'path'
import fs from 'fs'
import config from '../config.js'
import utilsFactory from './factory.js'

const {
  buildRequestUrl,
  getAssetsManifest,
  createStylesFor,
  hostFromReq,
  hrTimeToMs,
  isMultiSite,
  publicFolder,
  readHtmlTemplate,
  siteByHost,
  useStaticsByHost,
  criticalDir,
  criticalManifest
} = utilsFactory({path, fs, config})

export {
  buildRequestUrl,
  getAssetsManifest,
  createStylesFor,
  hostFromReq,
  hrTimeToMs,
  isMultiSite,
  publicFolder,
  readHtmlTemplate,
  siteByHost,
  useStaticsByHost,
  criticalDir,
  criticalManifest
}
