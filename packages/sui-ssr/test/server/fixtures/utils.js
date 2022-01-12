import path from 'path'
import fs from 'fs'
import {ssrConfig, ssrMultiSiteConfig} from './index.js'
import utilsFactory from '../../../server/utils/factory.js'

const {buildRequestUrl: buildRequestUrlWithConfig} = utilsFactory({
  path,
  fs,
  config: ssrConfig
})
const {
  buildRequestUrl: buildRequestUrlWithMultiSiteConfig,
  publicFolder: publicFolderWithMultiSiteConfig
} = utilsFactory({
  path,
  fs,
  config: ssrMultiSiteConfig
})

export {
  buildRequestUrlWithConfig,
  buildRequestUrlWithMultiSiteConfig,
  publicFolderWithMultiSiteConfig
}
