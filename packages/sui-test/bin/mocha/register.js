import {createRequire} from 'module'

import {getSWCConfig} from '@s-ui/compiler-config'

import {serverConfig} from '../../src/config.js'

const require = createRequire(import.meta.url)
const {forceTranspilation = [], useLibDir = false} = serverConfig
const regexToAdd = forceTranspilation.map(regexString => new RegExp(regexString))
const libDir = /lib/
const paths = [/@babel\/runtime/, /@s-ui/, /@adv-ui/, /mocks/, /src/, /test/, libDir, ...regexToAdd]
const only = useLibDir ? paths : paths.filter(path => path !== libDir)

const isTypeScript = false

// Register all source files.
require('@swc/register')({
  only,
  ...getSWCConfig({isTypeScript})
})
