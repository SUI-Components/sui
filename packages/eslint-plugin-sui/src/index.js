const FactoryPattern = require('./rules/factory-pattern.js')
const SerializeDeserialize = require('./rules/serialize-deserialize.js')
const CommonJS = require('./rules/commonjs.js')
const Decorators = require('./rules/decorators.js')
const LayersArch = require('./rules/layers-architecture.js')
const PrivateAttributesModel = require('./rules/private-attributes-model.js')

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
    'layers-arch': LayersArch,
    'private-attributes-model': PrivateAttributesModel
  }
}
