const DEFAULT_LEGACY_BROWSER_TARGETS = {
  ie: '11'
}

const DEFAULT_BROWSER_TARGETS = {
  chrome: '98',
  edge: '107',
  safari: '14.1',
  firefox: '108',
  ios: '14.5'
}

const getSWCConfig = ({isModern = false, isTypeScript = false, compileToCJS = false}) => {
  const targets = isModern ? DEFAULT_BROWSER_TARGETS : DEFAULT_LEGACY_BROWSER_TARGETS
  const syntaxOptions = isTypeScript ? {syntax: 'typescript', tsx: true} : {syntax: 'ecmascript', jsx: true}
  const moduleOptions = compileToCJS ? {module: {type: 'commonjs'}} : {}

  return {
    minify: true,
    jsc: {
      parser: {
        ...syntaxOptions,
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
      loose: true,
      externalHelpers: true
    },
    ...moduleOptions,
    env: {
      targets,
      dynamicImport: true,
      loose: true,
      mode: 'entry',
      coreJs: 3
    }
  }
}

module.exports.getSWCConfig = getSWCConfig
