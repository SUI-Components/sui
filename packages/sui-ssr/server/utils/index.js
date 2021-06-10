import path from 'path'
import fs from 'fs'
import config from '../config'
import utilsFactory from './factory'

const {
  buildRequestUrl,
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
