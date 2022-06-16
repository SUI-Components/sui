import fs from 'fs'
import path from 'path'

import utilsFactory from '../../../server/utils/factory.js'
import {ssrMultiSiteConfig} from './index.js'

const {publicFolder: publicFolderWithMultiSiteConfig} = utilsFactory({
  path,
  fs,
  config: ssrMultiSiteConfig
})

export {publicFolderWithMultiSiteConfig}
