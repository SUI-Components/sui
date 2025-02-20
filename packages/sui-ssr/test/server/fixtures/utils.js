import fs from 'fs'
import path from 'path'

import utilsFactory from '../../../server/utils/factory.js'
import {ssrConfig, ssrMultiSiteConfig} from './index.js'

const {publicFolder: publicFolderWithMultiSiteConfig} = utilsFactory({
  path,
  fs,
  config: ssrMultiSiteConfig
})

const {useStaticsFolderByHost: staticsFolderByHostWithMultiSiteConfig} = utilsFactory({
  path,
  fs,
  config: ssrMultiSiteConfig
})

const {useStaticsFolderByHost: staticsFolderByHostWithSingleSiteConfig} = utilsFactory({
  path,
  fs,
  config: ssrConfig
})

export {
  publicFolderWithMultiSiteConfig,
  staticsFolderByHostWithMultiSiteConfig,
  staticsFolderByHostWithSingleSiteConfig
}
