const DEFAULT_LEGACY_BROWSER_TARGETS = {
  ie: '11'
}

const DEFAULT_BROWSER_TARGETS = {
  chrome: '72',
  edge: '79',
  safari: '14',
  firefox: '80',
  opera: '60',
  ios: '14'
}

export const getSWCConfig = ({supportLegacyBrowsers}) => {
  const targets = supportLegacyBrowsers
    ? DEFAULT_LEGACY_BROWSER_TARGETS
    : DEFAULT_BROWSER_TARGETS
  const target = supportLegacyBrowsers ? 'es5' : 'es2018'

  return {
    minify: true,
    jsc: {
      parser: {
        syntax: 'ecmascript',
        jsx: true,
        dynamicImport: true,
        privateMethod: true,
        functionBind: true,
        exportDefaultFrom: true,
        exportNamespaceFrom: true,
        decorators: true,
        decoratorsBeforeExport: true,
        topLevelAwait: true,
        importMeta: true
      },
      transform: {
        legacyDecorator: true,
        react: {
          useBuiltins: true,
          runtime: 'automatic'
        }
      },
      target,
      loose: true,
      externalHelpers: true
    },
    env: {
      targets,
      dynamicImport: true,
      loose: true,
      mode: 'entry',
      coreJs: 3
    }
  }
}
