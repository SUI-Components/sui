const FactoryPattern = require('./rules/factory-pattern.js')
const SerializeDeserialize = require('./rules/serialize-deserialize.js')
const CommonJS = require('./rules/commonjs.js')
const Decorators = require('./rules/decorators.js')
const LayersArch = require('./rules/layers-architecture.js')
const CreationalPatternModel = require('./rules/creational-pattern-model.js')

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
    'creational-pattern-model': CreationalPatternModel
  }
}
