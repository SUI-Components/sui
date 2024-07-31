const FactoryPattern = require('./rules/factory-pattern.js')
const SerializeDeserialize = require('./rules/serialize-deserialize.js')
const CommonJS = require('./rules/commonjs.js')
const Decorators = require('./rules/decorators.js')
const DecoratorAsyncInlineError = require('./rules/decorator-async-inline-error.js')
const DecoratorDeprecated = require('./rules/decorator-deprecated.js')
const DecoratorDeprecatedRemarkMethod = require('./rules/decorator-deprecated-remark-method.js')
const DecoratorInlineError = require('./rules/decorator-inline-error.js')
const LayersArch = require('./rules/layers-architecture.js')

// ------------------------------------------------------------------------------
// Plugin Definition
// ------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports = {
  rules: {
    'factory-pattern': FactoryPattern,
    'serialize-deserialize': SerializeDeserialize,
    commonjs: CommonJS,
    decorators: Decorators,
    'decorator-async-inline-error': DecoratorAsyncInlineError,
    'decorator-deprecated': DecoratorDeprecated,
    'decorator-deprecated-remark-method': DecoratorDeprecatedRemarkMethod,
    'decorator-inline-error': DecoratorInlineError,
    'layers-arch': LayersArch
  }
}
