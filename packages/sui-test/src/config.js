const {getPackageJson} = require('@s-ui/helpers/packages')
const {config = {}} = getPackageJson(process.cwd())
const {'sui-test': suiTestConfig = {}} = config

const {client: clientConfig = {}, server: serverConfig = {}} = suiTestConfig

module.exports = {clientConfig, serverConfig}
