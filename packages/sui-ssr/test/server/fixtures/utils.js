import path from 'path'
import fs from 'fs'
import {ssrMultiSiteConfig} from './index.js'
import utilsFactory from '../../../server/utils/factory.js'

const {publicFolder: publicFolderWithMultiSiteConfig} = utilsFactory({
  path,
  fs,
  config: ssrMultiSiteConfig
})

export {publicFolderWithMultiSiteConfig}
