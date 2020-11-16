/**
 * Context to send to all status
 * @type {string}
 */
const STATUS_CONTEXT = '@s-ui/ci'

/**
 * Enum for status states
 * @readonly
 * @enum {string}
 */
const STATUS_STATES = {
  KO: 'error',
  RUN: 'pending',
  OK: 'success'
}

/**
 * Enum for status descriptions
 * @readonly
 * @enum {{[x: string]: string}}
 */
const STATUS_DESCRIPTION = {
  tests: {
    [STATUS_STATES.KO]: 'Failed passing tests!',
    [STATUS_STATES.OK]: 'All tests passed successfully!',
    [STATUS_STATES.RUN]: 'Testing components...'
  },
  bundle: {
    [STATUS_STATES.KO]: 'Bundling has failed!',
    [STATUS_STATES.OK]: 'Bundle completed!',
    [STATUS_STATES.RUN]: 'Creating bundle...'
  },
  lint: {
    [STATUS_STATES.KO]: 'Linting has failed!',
    [STATUS_STATES.OK]: 'Lint completed!',
    [STATUS_STATES.RUN]: 'Linting code...'
  },
  install: {
    [STATUS_STATES.KO]: 'Failed installing packages!',
    [STATUS_STATES.OK]: 'All packages installed!',
    [STATUS_STATES.RUN]: 'Installing packages...'
  },
  deploy: {
    [STATUS_STATES.KO]: 'Deploy failed!',
    [STATUS_STATES.OK]: 'Deployment has completed!',
    [STATUS_STATES.RUN]: 'Deploying your app...'
  }
}

module.exports = {STATUS_CONTEXT, STATUS_DESCRIPTION, STATUS_STATES}
