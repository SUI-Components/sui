const defaultConfig = require('./config/jest.config.js')
const defaultServerConfig = require('./config/jest.server.config.js')
const defaultBrowserConfig = require('./config/jest.browser.config.js')
const {hasFile, fromRoot} = require('./utils/index.js')

const JEST_CONFIG_FILE_NAME = 'jest.config.js'

module.exports = async ({ci, coverage, environment, watch, pattern}) => {
  const args = []
  let config = defaultConfig

  if (ci) args.push('--ci')
  if (coverage) args.push('--coverage')
  if (environment) args.push(...['--env', environment])
  if (pattern) defaultConfig.testMatch = [pattern]
  if (watch) args.push('--watch')

  // Add server support
  if (environment === 'node') {
    config = {...config, ...defaultServerConfig}
  }

  // Add browser support
  if (environment === 'jsdom') {
    config = {...config, ...defaultBrowserConfig}
  }

  // If project has a jest.config.js file, we merge it with the default one
  if (hasFile(JEST_CONFIG_FILE_NAME)) {
    const projectJestConfigPath = fromRoot(JEST_CONFIG_FILE_NAME)
    const projectJestConfig = require(projectJestConfigPath)
    config = {...config, ...projectJestConfig}
  }

  args.push(...['--config', JSON.stringify(config)])

  require('jest').run([...args])
}
