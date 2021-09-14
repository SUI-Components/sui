module.exports = {
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
    target: 'es5',
    loose: true,
    externalHelpers: true
  },
  env: {
    targets: {
      ie: '11'
    },
    dynamicImport: true,
    loose: true,
    mode: 'entry',
    coreJs: 3
  }
}
