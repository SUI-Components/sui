/* eslint no-console:0 */
const path = require('path');
const bootstrap = require('commitizen/dist/cli/git-cz').bootstrap;

bootstrap({
  debug: false,
  cliPath: path.join(process.cwd(), 'node_modules/commitizen'),
  config: {
    path: './node_modules/@sui/cz'
  }
});
