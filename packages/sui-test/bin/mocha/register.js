import {createRequire} from 'module'

import {getSWCConfig} from '@s-ui/compiler-config'
import {serverConfig} from '@s-ui/test/lib/config'

const require = createRequire(import.meta.url)
const {useLibDir = false} = serverConfig
const libDir = /lib/
const paths = [/@babel\/runtime/, /@s-ui/, /@adv-ui/, /mocks/, /src/, /test/, libDir]
const only = useLibDir ? paths : paths.filter(path => path !== libDir)
const isTypeScript = false

// Register all source files.
require('@swc/register')({
  only,
  ...getSWCConfig({isTypeScript})
})
