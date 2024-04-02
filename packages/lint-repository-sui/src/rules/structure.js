const dedent = require('string-dedent')

const FILES_AND_FOLDERS = [
  '.docker',
  '.github',
  'Makefile',
  'package.json',
  'package-lock.json',
  '.nvmrc',
  '.dockerignore',
  '.gitignore',
  'tsconfig.json',
  'README.md',

  'app/src',
  'app/test',
  'app/Makefile',
  'app/package.json',
  'app/tsconfig.json',
  'app/CHANGELOG.md',

  'app/src/pages',
  'app/src/app.(t|j)s(x)?',
  'app/src/contextFactory.(t|j)s(x)?',
  'app/src/hooks.(t|j)s(x)?',
  'app/src/index.html',
  'app/src/index.(s)?css',
  'app/src/routes.(t|j)s(x)?',
  'pacakges/**/src',
  'pacakges/**/test',
  'pacakges/**/Makefile',
  'pacakges/**/package.json',
  'pacakges/**/tsconfig.json',
  'pacakges/**/CHANGELOG.md',

  'deploy/config-(pre|pro).yml',
  'deploy/*-(pre|pro)-paas.yml',
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
        If you are not sure about how do it, please contact with Platform Web.
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
