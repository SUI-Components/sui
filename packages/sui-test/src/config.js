const {getPackageJson} = require('@s-ui/helpers/packages')
const {
  config = {},
  workspaces,
  private: isPrivate
} = getPackageJson(process.cwd())
const {'sui-bundler': bundlerConfig = {}, 'sui-test': suiTestConfig = {}} =
  config
const {client: clientConfig = {}, server: serverConfig = {}} = suiTestConfig

function isWorkspace() {
  return !workspaces && !isPrivate
}

module.exports = {
  bundlerConfig,
  clientConfig,
  serverConfig,
  isWorkspace
}
