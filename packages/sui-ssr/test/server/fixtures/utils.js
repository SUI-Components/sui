import fs from 'fs'
import path from 'path'

import utilsFactory from '../../../server/utils/factory.js'
import {ssrMultiSiteConfig} from './index.js'

const {publicFolder: publicFolderWithMultiSiteConfig, useStaticsFolderByHost: staticsFolderByHostWithMultiSiteConfig} =
  utilsFactory({
    path,
    fs,
    config: ssrMultiSiteConfig
  })

export {publicFolderWithMultiSiteConfig, staticsFolderByHostWithMultiSiteConfig}
