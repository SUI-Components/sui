const {getPackageJson} = require('@s-ui/helpers/packages')
const {config = {}} = getPackageJson(process.cwd())
const {'sui-test': suiTestConfig = {}} = config

const {
  client: clientConfig = {},
  e2e: e2eConfig = {},
  server: serverConfig = {}
} = suiTestConfig

module.exports = {clientConfig, e2eConfig, serverConfig}
