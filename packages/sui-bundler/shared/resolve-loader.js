import {createRequire} from 'module'

const require = createRequire(import.meta.url)

export const resolveLoader = {
  alias: {
    'externals-manifest-loader': require.resolve('../loaders/ExternalsManifestLoader')
  }
}
