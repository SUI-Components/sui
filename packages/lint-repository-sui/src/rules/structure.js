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
  'packages/**/src',
  'packages/**/test',
  'packages/**/Makefile',
  'packages/**/package.json',
  'packages/**/tsconfig.json',
  'packages/**/CHANGELOG.md',

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
      `,
      automergeDisabled: dedent`
        The dependabot automerge feature is disabled.
      `
    }
  },
  create: function (context) {
    return {
      ...Object.fromEntries(FILES_AND_FOLDERS.map(pattern => [pattern, () => context.monitoring(true)])),

      '.github/dependabot.yml': matches => {
        const [match] = matches
        const json = match.parsed
        const labels = json?.updates[0]?.labels || []
        const isAutomergeEnabled = labels.find(key => key === 'skynet:merge')

        if (!isAutomergeEnabled) {
          context.monitoring(false)
          context.report({
            messageId: 'automergeDisabled'
          })
          return
        }

        context.monitoring(true)
      },

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
