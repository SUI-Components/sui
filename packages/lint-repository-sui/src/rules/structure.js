const dedent = require('string-dedent')

const MANDATORY_PACKAGES = ['domain', 'literals', 'theme', 'ui']
const FILES_AND_FOLDERS = [
  '.docker',
  '.github',
  'Makefile',
  'package.json',
  'package-lock.json',
  '.nvmrc',
  '.dockerignore',
  '.gitignore',
  'README.md',
  'app/src',
  'app/Makefile',
  'app/package.json',
  'app/src/pages',
  'app/src/app.(t|j)s(x)?',
  'app/src/contextFactory{.js,.ts,/index.js,/index.ts}',
  'app/src/hooks{.js,.ts,/index.js,/index.ts}',
  'app/src/index.html',
  'app/src/index.(s)?css',
  'app/src/routes.(t|j)s(x)?',
  ...MANDATORY_PACKAGES.map(pkg => [
    `packages/${pkg}/src`,
    `packages/${pkg}/Makefile`,
    `packages/${pkg}/package.json`,
  ]).flat(Infinity),
  'packages/domain/test',
  'deploy/config-pro.yml',
  'deploy/*-pro-paas.yml',
  'deploy/tags.yml',
  'qa/e2e'
]

module.exports = {
  FILES_AND_FOLDERS,
  meta: {
    type: 'problem',
    docs: {
      description: 'Check that your repository follow the structure define',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements/02-project-structure.md'
    },
    fixable: null,
    schema: [],
    messages: {
      missingFileOrFolder: dedent`
        The file or folder {{pattern}} is missing.
        This repository should follow the Golden Path file Structure.
      `,
      automergeDisabled: dedent`
        The dependabot automerge feature is disabled.
      `
    }
  },
  create: function (context) {
    return {
      ...Object.fromEntries(FILES_AND_FOLDERS.map(pattern => [pattern, () => context.monitoring(true)])),
      missmatch: key => {
        context.monitoring(false)
        context.report({
          messageId: 'missingFileOrFolder',
          data: {pattern: key}
        })
      }
    }
  },
  reduceMonitoring: function (monitorings) {
    return monitorings.reduce((acc, signal) => {
      return acc && signal.value
    }, true)
  }
}
