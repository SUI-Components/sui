import path from 'path'
import fs from 'fs'
import config from '../config'
import utilsFactory from './factory'

const {
  isMultiSite,
  hostFromReq,
  publicFolder,
  useStaticsByHost,
  readHtmlTemplate,
  hrTimeToMs,
  buildRequestUrl
} = utilsFactory({path, fs, config})

export {
  isMultiSite,
  hostFromReq,
  publicFolder,
  useStaticsByHost,
  readHtmlTemplate,
  hrTimeToMs,
  buildRequestUrl
}
